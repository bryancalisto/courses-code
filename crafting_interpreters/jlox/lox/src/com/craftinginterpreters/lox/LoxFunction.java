package com.craftinginterpreters.lox;

import java.util.List;

public class LoxFunction implements LoxCallable {
    private final Stmt.Function declaration;
    private final Environment closure;
    private final Boolean isInitializer;

    public LoxFunction(Stmt.Function declaration, Environment environment, Boolean isInitializer) {
        this.closure = environment;
        this.declaration = declaration;
        this.isInitializer = isInitializer;
    }

    public LoxFunction bind(LoxInstance instance) {
        Environment environment = new Environment(closure);
        environment.define("this", instance);
        return new LoxFunction(declaration, environment, isInitializer);
    }

    @Override
    public int arity() {
        return declaration.parameters.size();
    }

    @Override
    public Object call(Interpreter interpreter, List<Object> arguments) {
        Environment environment = new Environment(closure);

        for (int i = 0; i < arity(); i++) {
            environment.define(declaration.parameters.get(i).lexeme, arguments.get(i));
        }

        try {
            interpreter.executeBlock(declaration.body, environment);
        } catch (Return returnStatement) {
            return returnStatement.value;
        }

        if (isInitializer) {
            return closure.getAt(0, "this");
        }

        return null;
    }

    @Override
    public String toString() {
        return "<fn " + declaration.name.lexeme + " >";
    }

}
