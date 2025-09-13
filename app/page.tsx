import { PasswordGenerator } from "@/components/password-generator";

export default function Home() {
  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-gradient-to-b from-background via-background to-muted/30 py-8">
      <div className="container mx-auto max-w px-4">
        <div className="text-center">
          {/* <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent text-balance">
            Secure Password Generator
          </h1>
          <p className="text-muted-foreground text-base md:text-lg text-pretty max-w-2xl mx-auto">
            Create strong, unique passwords instantly. Flexible options,
            readable passphrases, and one-click copy.
          </p> */}
        </div>
        <PasswordGenerator />
      </div>
    </main>
  );
}
