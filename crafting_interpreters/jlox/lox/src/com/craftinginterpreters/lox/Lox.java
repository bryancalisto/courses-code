package com.craftinginterpreters.lox;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static com.craftinginterpreters.lox.TokenType.EOF;

public class Lox {
    private static final Interpreter interpreter = new Interpreter();
    static boolean hadError = false;
    static boolean hadRuntimeError = false;

    public static void main(String[] args) throws IOException {
        if (args.length > 1) {
            System.out.println("Usage: jlox [script]");
            System.exit(64);
        } else if (args.length == 1) {
            runFile(args[0]);
        } else {
            runPrompt();
        }
    }

    private static void runFile(String path) throws IOException {
        byte[] bytes = Files.readAllBytes(Paths.get(path));
        run(new String(bytes, Charset.defaultCharset()));
        if (hadError) {
            System.exit(65);
        }
        if (hadRuntimeError) {
            System.exit(70);
        }
    }

    static void processOneLiner(BufferedReader reader) throws IOException {
//        System.out.print("> ");
//        String line = reader.readLine();
//        if (line == null) {
//            break;
//        }
//        run(line);
//        hadError = false;
    }

    private static void deleteLine() {
//        System.out.print("\033[2K");
        System.out.print("\b");
    }

    private static void runPrompt() throws IOException {
        InputStreamReader input = new InputStreamReader(System.in);
        BufferedReader reader = new BufferedReader(input);
        boolean readingBlock = false;
        StringBuilder statement = new StringBuilder();

        for (; ; ) {
            if (readingBlock) {
                System.out.print("... ");
            } else {
                System.out.print("> ");
            }

            String line = reader.readLine();

            if (line == null) {
                break;
            }

            if (line.contains("{")) {
                readingBlock = true;
                statement.append(line);
            }

            if (!readingBlock) {
                run(line);
            } else {
                statement.append(line);
            }

            if (line.contains("}")) {
                statement.append(line);
                String stmt = statement.toString();
                run(stmt);
                readingBlock = false;
                statement.setLength(0);
            }
            if (line.contains("\n")) {
                System.out.println("LINEA");
            }

            hadError = false;
        }
    }

    private static void run(String source) {
        Scanner scanner = new Scanner(source);
        List<Token> tokens = scanner.scanTokens();
        Parser parser = new Parser(tokens);
        List<Stmt> statements = parser.parse();

        if (hadError) return;

        Resolver resolver = new Resolver(interpreter);
        resolver.resolve(statements);

        if (hadError) return;

//        System.out.println(new AstPrinter().print(expression));
        interpreter.interpret(statements);
    }

    static void error(int line, String message) {
        report(line, "", message);
    }

    private static void report(int line, String where, String message) {
        System.err.println("[line " + line + "] Error" + where + ": " + message);
        hadError = true;
    }

    static void error(Token token, String message) {
        if (token.type == EOF) {
            report(token.line, " at end", message);
        } else {
            report(token.line, " at '" + token.lexeme + "'", message);
        }
    }

    static void runtimeError(RuntimeError e) {
        System.out.println(e.getMessage() + "\n[line " + e.token.line + "]");
        hadRuntimeError = true;
    }
}
