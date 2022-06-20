package com.craftinginterpreters.lox;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.craftinginterpreters.lox.TokenType.*;

public class Parser {
    private static class ParseError extends RuntimeException {
    }

    private final List<Token> tokens;
    private int current = 0;
    private int loopDepth = 0;


    public Parser(List<Token> tokens) {
        this.tokens = tokens;
    }

    List<Stmt> parse() {
        List<Stmt> statements = new ArrayList<>();

        while (!isAtEnd()) {
            statements.add(declaration());
        }

        return statements;
    }

    private Stmt declaration() {
        try {
            if (match(VAR)) return varDeclaration();
            if (match(FUN)) return function("function");
            return statement();
        } catch (ParseError error) {
            synchronize();
            return null;
        }
    }

    private Stmt function(String kind) {
        Token name = consume(IDENTIFIER, "Expected identifier");
        List<Token> parameters = new ArrayList();

        consume(LEFT_PAREN, "Expected '(' after " + kind + " name");

        if (!check(RIGHT_PAREN)) {
            do {
                if (parameters.size() > 255) {
                    error(peek(), "Too many arguments (> 255)");
                }
                parameters.add(consume(IDENTIFIER, "Expected parameter"));
            } while (match(COMMA));
        }

        consume(RIGHT_PAREN, "Expected ')' after " + kind + " arguments");
        consume(LEFT_BRACE, "Expected '{' before " + kind + " body");
        List<Stmt> body = block();

        return new Stmt.Function(name, parameters, body);
    }

    private Stmt statement() {
        if (match(IF)) return ifStatement();
        if (match(PRINT)) return printStatement();
        if (match(FOR)) return forStatement();
        if (match(BREAK)) return breakStatement();
        if (match(RETURN)) return returnStatement();
        if (match(WHILE)) return whileStatement();
        if (match(LEFT_BRACE)) return new Stmt.Block(block());

        return expressionStatement();
    }

    private Stmt returnStatement() {
        Token keyword = previous();
        Expr value = null;

        if(!check(SEMICOLON)){
            value = expression();
        }

        consume(SEMICOLON, "Expected ';' after return expression");
        return new Stmt.Return(keyword, value);
    }

    private Stmt forStatement() {
        try {
            loopDepth++;
            consume(LEFT_PAREN, "Expected '(' after for");

            Stmt initializer;
            if (match(VAR)) {
                initializer = varDeclaration();
            } else if (match(SEMICOLON)) {
                initializer = null;
            } else {
                initializer = expressionStatement();
            }

            Expr condition = null;
            if (!match(SEMICOLON)) {
                condition = expression();
            }

            consume(SEMICOLON, "Expected ';' after loop condition");

            Expr increment = null;
            if (!check(RIGHT_PAREN)) {
                increment = expression();
            }

            consume(RIGHT_PAREN, "Expected ')' after for clause");

            Stmt body = statement();

            if (increment != null) {
                body = new Stmt.Block(Arrays.asList(body, new Stmt.Expression(increment)));
            }

            if (condition == null) {
                condition = new Expr.Literal(true);
            }

            body = new Stmt.While(condition, body);

            if (initializer != null) {
                body = new Stmt.Block(Arrays.asList(initializer, body));
            }
            return body;
        } finally {
            loopDepth--;
        }
    }

    private Stmt whileStatement() {
        try {
            loopDepth++;
            consume(LEFT_PAREN, "Expected '(' after while");
            Expr condition = expression();
            consume(RIGHT_PAREN, "Expected ')' after condition");
            Stmt body = statement();
            return new Stmt.While(condition, body);
        } finally {
            loopDepth--;
        }
    }

    private Stmt breakStatement() {
        if (loopDepth == 0) {
            throw error(previous(), "'break' should be used within a loop");
        }
        consume(SEMICOLON, "Expected ';' after break");
        return new Stmt.Break();
    }

    private Stmt ifStatement() {
        consume(LEFT_PAREN, "Expect '(' after 'if'");
        Expr condition = expression();
        consume(RIGHT_PAREN, "Expect ')' after 'if' condition");

        Stmt thenBranch = statement();
        Stmt elseBranch = null;

        if (match(ELSE)) {
            elseBranch = statement();
        }

        return new Stmt.If(condition, thenBranch, elseBranch);
    }

    private Stmt printStatement() {
        Expr value = expression();
        consume(SEMICOLON, "Expect ';' after value.");
        return new Stmt.Print(value);
    }

    private Stmt varDeclaration() {
        Token name = consume(IDENTIFIER, "Expected variable name");

        Expr initializer = null;

        if (match(EQUAL)) {
            initializer = expression();
        }

        consume(SEMICOLON, "Expect ';' after variable declaration");

        return new Stmt.Var(name, initializer);
    }

    private Stmt expressionStatement() {
        Expr expr = expression();
        consume(SEMICOLON, "Expect ';' after value");
        return new Stmt.Expression(expr);
    }

    private List<Stmt> block() {
        ArrayList statements = new ArrayList();

        while (!check(RIGHT_BRACE) && !isAtEnd()) {
            statements.add(declaration());
        }

        consume(RIGHT_BRACE, "Expected a '}' to end block");
        return statements;
    }

    private Expr expression() {
//         TODO - Apply C expression evaluation with commas if expressions are not arguments of a function
//        if(peek().type == IDENTIFIER && peekNext().type == LEFT_PAREN){
//
//        }

        if (peek().type == COMMA) {
            throw error(peek(), "Expected expression before.");
        }

        Expr left = assignment();

        if (peek().type == COMMA) {
            advance();
            return expression();
        }

        return left;
    }

    private Expr assignment() {
        Expr expr = or();

        if (match(EQUAL)) {
            Token equals = previous();
            Expr value = assignment();

            if (expr instanceof Expr.Variable) {
                Token name = ((Expr.Variable) expr).name;
                return new Expr.Assign(name, value);
            }

            throw error(equals, "Invalid assignment target");
        }

        return expr;
    }

    private Expr or() {
        Expr left = and();

        while (match(OR)) {
            Token operator = previous();
            Expr right = and();
            left = new Expr.Logical(left, operator, right);
        }

        return left;
    }

    private Expr and() {
        Expr left = equality();

        while (match(AND)) {
            Token operator = previous();
            Expr right = equality();
            left = new Expr.Logical(left, operator, right);
        }

        return left;
    }

    private Expr equality() {
        Expr expr = comparison();

        while (match(BANG_EQUAL, EQUAL_EQUAL)) {
            Token operator = previous();
            Expr right = comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private boolean match(TokenType... types) {
        for (TokenType type : types) {
            if (check(type)) {
                advance();
                return true;
            }
        }

        return false;
    }

    private Token advance() {
        if (!isAtEnd()) current++;
        return previous();
    }

    private boolean isAtEnd() {
        return peek().type == EOF;
    }

    private Token previous() {
        return tokens.get(current - 1);
    }

    private Token peek() {
        return tokens.get(current);
    }

    private boolean check(TokenType type) {
        if (isAtEnd()) return false;
        return peek().type == type;
    }

    private Expr comparison() {
        Expr expr = term();

        while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
            Token operator = previous();
            Expr right = comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Expr term() {
        Expr expr = factor();

        while (match(PLUS, MINUS)) {
            Token operator = previous();
            Expr right = term();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Expr factor() {
        Expr expr = unary();

        while (match(SLASH, STAR)) {
            Token operator = previous();
            Expr right = factor();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Expr unary() {
        if (match(MINUS, BANG)) {
            Token operator = previous();
            Expr right = unary();
            return new Expr.Unary(operator, right);
        }

        return call();
    }

    private Expr call() {
        Expr expr = primary();
        List<Expr> arguments;

        while (true) {
            if (match(LEFT_PAREN)) {
                arguments = new ArrayList<>();

                if (!check(RIGHT_PAREN)) {
                    do {
                        if (arguments.size() > 255) {
                            error(peek(), "Too many arguments (> 255)");
                        }
                        arguments.add(expression());
                    } while (match(COMMA));
                }

                Token rightParenthesis = consume(RIGHT_PAREN, "Expected closing ')'");

                expr = new Expr.Call(expr, rightParenthesis, arguments);
            } else {
                break;
            }
        }

        return expr;
    }

    private Expr primary() {
        if (match(FALSE)) return new Expr.Literal(false);
        if (match(TRUE)) return new Expr.Literal(true);
        if (match(NIL)) return new Expr.Literal(null);

        if (match(NUMBER, STRING)) {
            return new Expr.Literal(previous().literal);
        }

        if (match(IDENTIFIER)) {
            return new Expr.Variable(previous());
        }

        if (match(LEFT_PAREN)) {
            Expr expr = expression();
            consume(RIGHT_PAREN, "Expected ')' after expression");
            return new Expr.Grouping(expr);
        }

        throw error(peek(), "Expected expression.");
    }

    private Token consume(TokenType type, String message) {
        if (check(type)) {
            return advance();
        }

        throw error(peek(), message);
    }

    private ParseError error(Token token, String message) {
        Lox.error(token, message);
        return new ParseError();
    }

    private void synchronize() {
        advance();

        while (!isAtEnd()) {
            if (previous().type == SEMICOLON) return;

            switch (peek().type) {
                case CLASS:
                case FOR:
                case FUN:
                case IF:
                case PRINT:
                case RETURN:
                case VAR:
                case WHILE:
                    return;
            }
        }

        advance();
    }
}
