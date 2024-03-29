package com.craftinginterpreters.lox;

import java.util.*;

import static com.craftinginterpreters.lox.TokenType.*;

class VariableState {
    public VariableState(Token token) {
        this.token = token;
    }

    public VariableState(Token token, boolean initialized) {
        this.token = token;
        this.initialized = initialized;
    }

    Token token;
    boolean initialized = false;
    boolean read = false;
}

// Resolves the environments the variables should live in in terms of scope
public class Resolver implements Expr.Visitor<Void>, Stmt.Visitor<Void> {
    private final Interpreter interpreter;
    private final Stack<Map<String, VariableState>> scopes = new Stack();
    private FunctionType currentFunction = FunctionType.NONE;
    private ClassType currentClass = ClassType.NONE;
    Set<TokenType> notReadRequiredTokens = new HashSet<>();

    public Resolver(Interpreter interpreter) {
        this.interpreter = interpreter;
        notReadRequiredTokens.add(THIS);
        notReadRequiredTokens.add(SUPER);
    }

    @Override
    public Void visitBlockStmt(Stmt.Block stmt) {
        beginScope();
        resolve(stmt.statements);
        endScope();
        return null;
    }

    @Override
    public Void visitVarStmt(Stmt.Var stmt) {
        declare(stmt.name);
        if (stmt.initializer != null) {
            resolve(stmt.initializer);
        }
        define(stmt.name);
        return null;
    }

    @Override
    public Void visitVariableExpr(Expr.Variable expr) {
        if (!scopes.isEmpty() && scopes.peek().containsKey(expr.name.lexeme) == Boolean.FALSE) {
            Lox.error(expr.name, "Cannot use the variable in it's initializer");
        }

        resolveLocal(expr, expr.name);
        return null;
    }

    @Override
    public Void visitAssignExpr(Expr.Assign expr) {
        resolve(expr.value);
        resolveLocal(expr, expr.name);
        return null;
    }

    @Override
    public Void visitFunctionStmt(Stmt.Function stmt) {
        declare(stmt.name);
        define(stmt.name);
        resolveFunction(stmt, FunctionType.FUNCTION);
        return null;
    }

    @Override
    public Void visitClassStmt(Stmt.Class stmt) {
        ClassType enclosingClass = currentClass;
        currentClass = ClassType.CLASS;

        declare(stmt.name);

        if (stmt.superclass != null) {
            currentClass = ClassType.SUBCLASS;
            if (stmt.superclass.name.lexeme.equals(stmt.name.lexeme)) {
                Lox.error(stmt.superclass.name, "A class cannot inherit from itself");
            }

            resolve(stmt.superclass);
        }

        if (stmt.superclass != null) {
            beginScope();
            scopes.peek().put("super", new VariableState(new Token(TokenType.SUPER, "super", null, stmt.name.line), true));
        }

        beginScope();

        VariableState thisVariable = new VariableState(new Token(TokenType.THIS, "this", null, stmt.name.line));
        thisVariable.initialized = true;
        thisVariable.read = true;

        scopes.peek().put("this", thisVariable);

        for (Stmt.Function method : stmt.methods) {
            resolveFunction(method, method.name.lexeme.equals("init") ? FunctionType.INITIALIZER : FunctionType.METHOD);
        }

        endScope();

        if (stmt.superclass != null) endScope();

        currentClass = enclosingClass;
        return null;
    }

    @Override
    public Void visitExpressionStmt(Stmt.Expression stmt) {
        resolve(stmt.expression);
        return null;
    }

    @Override
    public Void visitIfStmt(Stmt.If stmt) {
        resolve(stmt.condition);
        resolve(stmt.thenBranch);
        if (stmt.elseBranch != null) resolve(stmt.elseBranch);
        return null;
    }

    @Override
    public Void visitPrintStmt(Stmt.Print stmt) {
        resolve(stmt.expression);
        return null;
    }

    @Override
    public Void visitReturnStmt(Stmt.Return stmt) {
        if (currentFunction == FunctionType.NONE) {
            Lox.error(stmt.name, "Cannot return outside function");
        }

        if (stmt.value != null) {
            if (currentFunction == FunctionType.INITIALIZER) {
                Lox.error(stmt.name, "Cannot return a value from initializer");
            }
            resolve(stmt);
        }

        return null;
    }

    @Override
    public Void visitWhileStmt(Stmt.While stmt) {
        resolve(stmt.condition);
        resolve(stmt.body);
        return null;
    }

    @Override
    public Void visitBreakStmt(Stmt.Break stmt) {
        return null;
    }

    @Override
    public Void visitBinaryExpr(Expr.Binary expr) {
        resolve(expr.left);
        resolve(expr.right);
        return null;
    }

    @Override
    public Void visitCallExpr(Expr.Call expr) {
        resolve(expr.callee);

        for (Expr arg : expr.arguments) {
            resolve(arg);
        }

        return null;
    }

    @Override
    public Void visitThisExpr(Expr.This expr) {
        if (currentClass == ClassType.NONE) {
            Lox.error(expr.token, "'this' can only be used inside a class");
        }
        resolveLocal(expr, expr.token);
        return null;
    }

    @Override
    public Void visitGetExpr(Expr.Get expr) {
        resolve(expr.object);
        return null;
    }

    @Override
    public Void visitSetExpr(Expr.Set expr) {
        resolve(expr.object);
        resolve(expr.value);
        return null;
    }

    @Override
    public Void visitGroupingExpr(Expr.Grouping expr) {
        resolve(expr);
        return null;
    }

    @Override
    public Void visitLiteralExpr(Expr.Literal expr) {
        return null;
    }

    @Override
    public Void visitLogicalExpr(Expr.Logical expr) {
        resolve(expr.left);
        resolve(expr.right);
        return null;
    }

    @Override
    public Void visitUnaryExpr(Expr.Unary expr) {
        resolve(expr.right);
        return null;
    }

    @Override
    public Void visitSuperExpr(Expr.Super expr) {
        if (currentClass == ClassType.NONE) {
            Lox.error(expr.keyword, "Cannot use 'super' outside a class");
        } else if (currentClass != ClassType.SUBCLASS) {
            Lox.error(expr.keyword, "Cannot use 'super' in a class without superclass");
        }

        resolveLocal(expr, expr.keyword);
        return null;
    }

    public void resolve(List<Stmt> statements) {
        for (Stmt stmt : statements) {
            resolve(stmt);
        }

        // If a local variable was not used, report error
        for (int i = 0; i < scopes.size(); i++) {
            for (VariableState varState : scopes.get(i).values()) {
                if (!varState.read && !notReadRequiredTokens.contains(varState.token.type)) {
                    Lox.error(varState.token, "Variable " + varState.token.lexeme + " is not being used. Remove it");
                }
            }
        }
    }

    public void resolve(Stmt stmt) {
        stmt.accept(this);
    }

    public void resolve(Expr expr) {
        expr.accept(this);
    }

    private void beginScope() {
        scopes.push(new HashMap<String, VariableState>());
    }

    private void endScope() {
        scopes.pop();
    }

    private void declare(Token name) {
        if (scopes.isEmpty()) return;

        if (scopes.contains(name)) {
            Lox.error(name, "Variable " + name.lexeme + " already exists in this scope");
        }

        scopes.peek().put(name.lexeme, new VariableState(name));
    }

    private void define(Token name) {
        if (scopes.isEmpty()) return;

        VariableState state = scopes.peek().get(name.lexeme);
        state.initialized = true;
    }

    private void resolveLocal(Expr expr, Token name) {
        for (int i = scopes.size() - 1; i >= 0; i--) {
            if (scopes.get(i).containsKey(name.lexeme)) {
                // Change here the 'read' field of varState to true if the variable was read
                scopes.get((i)).get(name.lexeme).read = true;
                interpreter.resolve(expr, scopes.size() - 1 - i);
                return;
            }
        }
    }

    private void resolveFunction(Stmt.Function function, FunctionType type) {
        FunctionType enclosingFunction = currentFunction;
        currentFunction = type;

        beginScope();

        for (Token param : function.parameters) {
            declare(param);
            define(param);
        }

        resolve(function.body);

        endScope();

        currentFunction = enclosingFunction;
    }
}

enum FunctionType {
    NONE,
    FUNCTION,
    METHOD,
    INITIALIZER
}

enum ClassType {
    NONE,
    CLASS,
    SUBCLASS
}