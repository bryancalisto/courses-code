class Salute {
  public static void main(String[] args) {
    if (args.length != 1) {
      System.out.println("Usage: Salute <name>");
      System.exit(0);
    }

    Utils.sayHello(args[0]);
  }
}