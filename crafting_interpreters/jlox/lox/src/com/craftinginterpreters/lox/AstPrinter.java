package com.craftinginterpreters.lox;

import java.util.Stack;

public class AstPrinter implements Expr.Visitor<String> {

    public String print(Expr expr) {
        return expr.accept(this);
    }

    private String parenthesize(String name, Expr... exprs) {
        StringBuilder sb = new StringBuilder();

        sb.append("(").append(name);

        for (Expr exp : exprs) {
            sb.append(" ").append(exp.accept(this));
        }

        sb.append(")");

        return sb.toString();
    }

    public static void main(String[] args) {
        Expr expression1 = new Expr.Binary(
                new Expr.Unary(
                        new Token(TokenType.MINUS, "-", null, 1),
                        new Expr.Literal(123)
                ),
                new Token(TokenType.STAR, "*", null, 1),
                new Expr.Grouping(
                        new Expr.Literal(45.67)
                )
        );

        Expr expression2 = new Expr.Binary(
                new Expr.Grouping(
                        new Expr.Binary(
                                new Expr.Literal(1),
                                new Token(TokenType.PLUS, "+",null, 1),
                                new Expr.Literal(2)
                        )
                ),
                new Token(TokenType.STAR, "*", null, 1),
                new Expr.Grouping(
                        new Expr.Binary(
                                new Expr.Literal(4),
                                new Token(TokenType.MINUS, "-",null, 1),
                                new Expr.Literal(3)
                        )
                )
        );

        System.out.println("Parenthesized");
        System.out.println(new AstPrinter().print(expression1));
        System.out.println(new AstPrinter().print(expression2));
        System.out.println("Reversed polish notation");
        System.out.println(new AstPrinterRPN().print(expression1));
        System.out.println(new AstPrinterRPN().print(expression2));
    }

    @Override
    public String visitBinaryExpr(Expr.Binary expr) {
        return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    @Override
    public String visitGroupingExpr(Expr.Grouping expr) {
        return parenthesize("group", expr.expression);
    }

    @Override
    public String visitLiteralExpr(Expr.Literal expr) {
        if (expr.value == null) return "nil";
        return expr.value.toString();
    }

    @Override
    public String visitUnaryExpr(Expr.Unary expr) {
        return parenthesize(expr.operator.lexeme, expr.right);
    }
}

class AstPrinterRPN {
    String print(Expr expr){
        if(expr instanceof Expr.Binary){
            return print(((Expr.Binary) expr).left) + " " + print(((Expr.Binary) expr).right) + " "+ ((Expr.Binary) expr).operator.lexeme;
        }

        if(expr instanceof Expr.Unary){
            return print(((Expr.Unary) expr).right) + " " + ((Expr.Unary) expr).operator.lexeme;
        }

        if(expr instanceof Expr.Literal){
            return ((Expr.Literal) expr).value.toString();
        }

        if(expr instanceof Expr.Grouping){
            return print(((Expr.Grouping) expr).expression);
        }

        return "";
    }
}
