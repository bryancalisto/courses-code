package com.craftinginterpreters.tool;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

public class GenerateAst {
    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Usage: generate_ast <output_directory>");
            System.exit(64);
        }

        String outputDir = args[0];

        try {
            defineAst(outputDir, "Expr", Arrays.asList(
                    "Assign      : Token name, Expr value",
                    "Binary     : Expr left, Token operator, Expr right",
                    "Grouping   : Expr expression",
                    "Literal    : Object value",
                    "Logical    : Expr left, Token operator, Expr right",
                    "Variable   : Token name",
                    "Call       : Expr callee, Token parentheses, List<Expr> arguments",
                    "This       : Token token",
                    "Get        : Expr object, Token name",
                    "Set        : Expr object, Token name, Expr value",
                    "Unary      : Token operator, Expr right",
                    "Super      : Token keyword, Token method"
            ));

            defineAst(outputDir, "Stmt", Arrays.asList(
                    "Block      : List<Stmt> statements",
                    "Class      : Token name, Expr.Variable superclass, List<Stmt.Function> methods",
                    "If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
                    "Expression : Expr expression",
                    "While      : Expr condition, Stmt body",
                    "Break      :",
                    "Function   : Token name, List<Token> parameters, List<Stmt> body",
                    "Return     : Token name, Expr value",
                    "Var        : Token name, Expr initializer",
                    "Print      : Expr expression"
            ));
        } catch (Exception e) {
            System.err.println("ERROR: " + e);
        }
    }

    private static void defineAst(
            String outputDir, String baseName, List<String> types)
            throws IOException {
        String path = outputDir + "/" + baseName + ".java";
        PrintWriter writer = new PrintWriter(path, StandardCharsets.UTF_8);

        writer.println("package com.craftinginterpreters.lox;");
        writer.println();
        writer.println("import java.util.List;");
        writer.println();
        writer.println("abstract class " + baseName + " {");

        defineVisitor(writer, baseName, types);

        // The AST classes.
        for (String type : types) {
            String[] typeComponents = type.split(":");
            String className = typeComponents[0].trim();
            String fields = "";

            if (typeComponents.length > 1) {
                fields = type.split(":")[1].trim();
            }

            defineType(writer, baseName, className, fields);
        }

        // The base 'accept' method
        writer.println();
        writer.println("    abstract <R> R accept(Visitor<R> visitor);");

        writer.println("}");
        writer.close();
    }

    private static void defineVisitor(PrintWriter writer, String baseName, List<String> types) {
        writer.println("    interface Visitor<R> {");

        for (String type : types) {
            String typeName = type.split(":")[0].trim();
            writer.println("    R visit" + typeName + baseName + "(" + typeName + " " + baseName.toLowerCase() + ");");
        }

        writer.println("}");
    }

    private static void defineType(
            PrintWriter writer, String baseName,
            String className, String fieldList) {
        writer.println("  static class " + className + " extends " +
                baseName + " {");

        // Constructor.
        writer.println("    " + className + "(" + fieldList + ") {");

        // Store parameters in fields if parameters exist
        String[] fields = fieldList.isBlank() ? null : fieldList.split(", ");

        if (fields != null) {
            for (String field : fields) {
                String name = field.split(" ")[1];
                writer.println("      this." + name + " = " + name + ";");
            }
        }

        writer.println("    }");

        // Visitor pattern
        writer.println("    @Override");
        writer.println("    <R> R accept(Visitor<R> visitor) {");
        writer.println("        return visitor.visit" + className + baseName + "(this);");
        writer.println("    }");
        writer.println();

        // Fields.

        if (fields != null) {
            for (String field : fields) {
                writer.println("    final " + field + ";");
            }
        }

        writer.println("  }");
    }
}
