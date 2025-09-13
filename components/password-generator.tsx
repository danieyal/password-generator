"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  RefreshCw,
  Shield,
  Check,
  History,
  Trash2,
  FileDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface PasswordOptions {
  type: "random" | "readable";
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  wordCount: number;
  separator: string;
  capitalizeWords: boolean;
  includeNumbersInWords: boolean;
  requireCoverage?: boolean;
}

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR_CHARS = "il1Lo0O";

const WORD_LISTS = {
  common: [
    "apple",
    "beach",
    "chair",
    "dance",
    "eagle",
    "flame",
    "grape",
    "house",
    "island",
    "jungle",
    "kite",
    "lemon",
    "music",
    "night",
    "ocean",
    "piano",
    "queen",
    "river",
    "stone",
    "tiger",
    "umbrella",
    "valley",
    "water",
    "yellow",
    "zebra",
    "bridge",
    "cloud",
    "dream",
    "forest",
    "garden",
    "happy",
    "light",
    "magic",
    "peace",
    "smile",
    "storm",
    "sweet",
    "trust",
    "voice",
    "wonder",
  ],
  animals: [
    "bear",
    "cat",
    "dog",
    "elephant",
    "fox",
    "giraffe",
    "horse",
    "iguana",
    "jaguar",
    "koala",
    "lion",
    "monkey",
    "newt",
    "owl",
    "panda",
    "quail",
    "rabbit",
    "snake",
    "turtle",
    "unicorn",
    "vulture",
    "whale",
    "xerus",
    "yak",
    "zebra",
    "dolphin",
    "penguin",
    "tiger",
    "wolf",
    "eagle",
  ],
  nature: [
    "mountain",
    "river",
    "forest",
    "ocean",
    "desert",
    "valley",
    "meadow",
    "canyon",
    "lake",
    "stream",
    "flower",
    "tree",
    "grass",
    "stone",
    "cloud",
    "rain",
    "snow",
    "wind",
    "sun",
    "moon",
    "star",
    "earth",
    "fire",
    "water",
    "air",
    "leaf",
    "branch",
    "root",
    "seed",
    "bloom",
  ],
};

export function PasswordGenerator() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    type: "random",
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    wordCount: 4,
    separator: "-",
    capitalizeWords: true,
    includeNumbersInWords: true,
    requireCoverage: true,
  });
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [selectedWordList, setSelectedWordList] =
    useState<keyof typeof WORD_LISTS>("common");
  const [autoGenerate, setAutoGenerate] = useState<boolean>(true);
  const [preset, setPreset] = useState<string>("custom");
  const [bulkCount, setBulkCount] = useState<number>(10);
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [breachCheckEnabled, setBreachCheckEnabled] = useState<boolean>(false);
  const [breachStatus, setBreachStatus] = useState<
    | { state: "idle" }
    | { state: "checking" }
    | { state: "safe" }
    | { state: "compromised"; count: number }
    | { state: "error" }
  >({ state: "idle" });

  // Load persisted state on mount
  useEffect(() => {
    try {
      const storedOptions = localStorage.getItem("pg_options");
      const storedHistory = localStorage.getItem("pg_history");
      const storedPassword = localStorage.getItem("pg_last_password");
      const storedWordList = localStorage.getItem("pg_wordlist") as
        | keyof typeof WORD_LISTS
        | null;
      const storedAuto = localStorage.getItem("pg_auto_generate");
      const storedPreset = localStorage.getItem("pg_preset");
      const storedBulkCount = localStorage.getItem("pg_bulk_count");
      const storedBreach = localStorage.getItem("pg_breach_check");
      if (storedOptions) setOptions(JSON.parse(storedOptions));
      if (storedHistory) setPasswordHistory(JSON.parse(storedHistory));
      if (storedPassword) setPassword(storedPassword);
      if (storedWordList && WORD_LISTS[storedWordList])
        setSelectedWordList(storedWordList);
      if (storedAuto !== null) setAutoGenerate(storedAuto === "true");
      if (storedPreset) setPreset(storedPreset);
      if (storedBulkCount) setBulkCount(Number(storedBulkCount));
      if (storedBreach !== null) setBreachCheckEnabled(storedBreach === "true");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem("pg_options", JSON.stringify(options));
    } catch {}
  }, [options]);
  useEffect(() => {
    try {
      localStorage.setItem("pg_history", JSON.stringify(passwordHistory));
    } catch {}
  }, [passwordHistory]);
  useEffect(() => {
    try {
      if (password) localStorage.setItem("pg_last_password", password);
    } catch {}
  }, [password]);
  useEffect(() => {
    try {
      localStorage.setItem("pg_wordlist", selectedWordList);
    } catch {}
  }, [selectedWordList]);
  useEffect(() => {
    try {
      localStorage.setItem("pg_auto_generate", String(autoGenerate));
    } catch {}
  }, [autoGenerate]);
  useEffect(() => {
    try {
      localStorage.setItem("pg_preset", preset);
    } catch {}
  }, [preset]);
  useEffect(() => {
    try {
      localStorage.setItem("pg_bulk_count", String(bulkCount));
    } catch {}
  }, [bulkCount]);
  useEffect(() => {
    try {
      localStorage.setItem("pg_breach_check", String(breachCheckEnabled));
    } catch {}
  }, [breachCheckEnabled]);

  const generateReadablePassword = useCallback(() => {
    const wordList = WORD_LISTS[selectedWordList];
    const selectedWords: string[] = [];

    // Select random words
    for (let i = 0; i < options.wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      let word = wordList[randomIndex];

      if (options.capitalizeWords) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }

      selectedWords.push(word);
    }

    const sep = options.separator === "none" ? "" : options.separator;
    let result = selectedWords.join(sep);

    // Add numbers if requested
    if (options.includeNumbersInWords) {
      const randomNum = Math.floor(Math.random() * 999) + 1;
      result += sep + String(randomNum);
    }

    return result;
  }, [
    options.wordCount,
    options.separator,
    options.capitalizeWords,
    options.includeNumbersInWords,
    selectedWordList,
  ]);

  const generateRandomPassword = useCallback(() => {
    let charset = "";

    if (options.includeLowercase) charset += LOWERCASE;
    if (options.includeUppercase) charset += UPPERCASE;
    if (options.includeNumbers) charset += NUMBERS;
    if (options.includeSymbols) charset += SYMBOLS;

    if (options.excludeSimilar) {
      charset = charset
        .split("")
        .filter((char) => !SIMILAR_CHARS.includes(char))
        .join("");
    }

    if (charset === "") {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
      return "";
    }

    // Coverage-aware generation with shuffle
    const coveragePools: string[] = [];
    if (options.requireCoverage) {
      if (options.includeLowercase) coveragePools.push(LOWERCASE);
      if (options.includeUppercase) coveragePools.push(UPPERCASE);
      if (options.includeNumbers) coveragePools.push(NUMBERS);
      if (options.includeSymbols) coveragePools.push(SYMBOLS);
    }

    const bytes = new Uint8Array(options.length);
    crypto.getRandomValues(bytes);

    const chars: string[] = [];
    // Ensure at least one from each selected bucket if enabled
    for (let i = 0; i < coveragePools.length && i < options.length; i++) {
      const pool = coveragePools[i];
      chars.push(pool[bytes[i] % pool.length]);
    }
    // Fill the rest from the full charset
    for (let i = chars.length; i < options.length; i++) {
      chars.push(charset[bytes[i] % charset.length]);
    }
    // Fisher-Yates shuffle using existing random bytes
    for (let i = chars.length - 1; i > 0; i--) {
      const j = bytes[i] % (i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join("");
  }, [options, toast]);

  const generatePassword = useCallback(() => {
    let newPassword = "";

    if (options.type === "readable") {
      newPassword = generateReadablePassword();
    } else {
      newPassword = generateRandomPassword();
    }

    if (newPassword) {
      setPassword(newPassword);
      setCopied(false);

      // Add to history
      setPasswordHistory((prev) => {
        const updated = [newPassword, ...prev.filter((p) => p !== newPassword)];
        return updated.slice(0, 10); // Keep only last 10 passwords
      });
    }
  }, [options.type, generateReadablePassword, generateRandomPassword]);

  const copyToClipboard = async (textToCopy = password) => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy password.",
        variant: "destructive",
      });
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "None", color: "bg-muted" };

    let score = 0;

    if (options.type === "readable") {
      // Different scoring for readable passwords
      if (password.length >= 12) score += 2;
      if (password.length >= 20) score += 1;
      if (options.wordCount >= 4) score += 1;
      if (options.includeNumbersInWords) score += 1;
      if (options.capitalizeWords) score += 1;
    } else {
      // Original scoring for random passwords
      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
    }

    if (score <= 2) return { score, label: "Weak", color: "bg-destructive" };
    if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" };
    return { score, label: "Strong", color: "bg-accent" };
  };

  const strength = getPasswordStrength();

  // Entropy & time-to-crack estimates
  const estimate = (() => {
    const log2 = (n: number) => Math.log(n) / Math.log(2);
    let bits = 0;
    if (options.type === "random") {
      let charset = "";
      if (options.includeLowercase) charset += LOWERCASE;
      if (options.includeUppercase) charset += UPPERCASE;
      if (options.includeNumbers) charset += NUMBERS;
      if (options.includeSymbols) charset += SYMBOLS;
      if (options.excludeSimilar) {
        charset = charset
          .split("")
          .filter((c) => !SIMILAR_CHARS.includes(c))
          .join("");
      }
      const S = Math.max(1, charset.length);
      bits = options.length * log2(S);
    } else {
      const wordListSize = WORD_LISTS[selectedWordList].length;
      bits = options.wordCount * log2(Math.max(1, wordListSize));
      if (options.capitalizeWords) bits += options.wordCount * 1; // approx 1 bit/word
      if (options.includeNumbersInWords) bits += log2(999); // ~10 bits
    }
    const guesses = Math.pow(2, bits);
    const onlineRate = 100; // guesses/sec (rate-limited online)
    const offlineRate = 1e10; // high-end GPU rig
    const medianFactor = 0.5;
    const onlineSeconds = (guesses * medianFactor) / onlineRate;
    const offlineSeconds = (guesses * medianFactor) / offlineRate;
    const fmt = (s: number) => {
      if (!isFinite(s) || s <= 0) return "instant";
      const units: [number, string][] = [
        [60, "s"],
        [60, "m"],
        [24, "h"],
        [365, "d"],
        [Number.MAX_SAFE_INTEGER, "y"],
      ];
      let value = s;
      let label = "s";
      let idx = 0;
      while (idx < units.length - 1 && value >= units[idx][0]) {
        value = value / units[idx][0];
        label = units[idx + 1][1];
        idx++;
      }
      return `${value.toFixed(1)}${label}`;
    };
    return {
      bits: Math.round(bits),
      online: fmt(onlineSeconds),
      offline: fmt(offlineSeconds),
    };
  })();

  // Breach (HIBP) k-anonymity check
  async function sha1Hex(input: string): Promise<string> {
    const enc = new TextEncoder();
    const data = enc.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const bytes = new Uint8Array(hashBuffer);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function run() {
      if (!breachCheckEnabled || !password) {
        setBreachStatus({ state: "idle" });
        return;
      }
      try {
        setBreachStatus({ state: "checking" });
        const hex = await sha1Hex(password);
        const prefix = hex.slice(0, 5);
        const suffix = hex.slice(5);
        const res = await fetch(
          `https://api.pwnedpasswords.com/range/${prefix}`,
          {
            signal: controller.signal,
            headers: { "Add-Padding": "true" },
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("network");
        const text = await res.text();
        if (cancelled) return;
        const line = text.split("\n").find((l) => l.startsWith(suffix));
        if (line) {
          const parts = line.trim().split(":");
          const count = Number(parts[1] || 0);
          setBreachStatus({
            state: "compromised",
            count: isNaN(count) ? 0 : count,
          });
        } else {
          setBreachStatus({ state: "safe" });
        }
      } catch {
        if (!cancelled) setBreachStatus({ state: "error" });
      }
    }
    // debounce slightly to avoid spamming API while typing
    const t = setTimeout(run, 300);
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(t);
    };
  }, [breachCheckEnabled, password]);

  // Preset handling
  const applyPreset = (key: string) => {
    setPreset(key);
    if (key === "custom") return;
    if (key === "nist-strong") {
      setOptions((prev) => ({
        ...prev,
        type: "random",
        length: Math.max(prev.length, 16),
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        requireCoverage: true,
      }));
    } else if (key === "no-symbols-16") {
      setOptions((prev) => ({
        ...prev,
        type: "random",
        length: Math.max(prev.length, 16),
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: false,
        requireCoverage: true,
      }));
    } else if (key === "passphrase-4w") {
      setOptions((prev) => ({
        ...prev,
        type: "readable",
        wordCount: Math.max(prev.wordCount, 4),
        separator: "-",
        capitalizeWords: true,
        includeNumbersInWords: true,
      }));
    }
  };

  const validateCompliance = () => {
    const issues: string[] = [];
    if (options.type === "random") {
      if (options.length < 12) issues.push("Length under 12");
      const selected = [
        options.includeLowercase,
        options.includeUppercase,
        options.includeNumbers,
        options.includeSymbols,
      ].filter(Boolean).length;
      if (selected < 3) issues.push("Use at least 3 character types");
      if (options.requireCoverage === false)
        issues.push("Enable guaranteed coverage");
    } else {
      if (options.wordCount < 4) issues.push("Use ≥ 4 words");
      if (!options.includeNumbersInWords)
        issues.push("Add a number to increase entropy");
    }
    return issues;
  };
  const complianceIssues = validateCompliance();

  useEffect(() => {
    if (autoGenerate) {
      generatePassword();
    }
  }, [generatePassword, autoGenerate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* Generated Password Display */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Generated Password
          </CardTitle>
          <CardDescription>
            Your secure password is ready to use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              value={password}
              readOnly
              aria-label="Generated password"
              className="font-mono text-lg pr-24"
              placeholder="Click generate to create a password"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard()}
                      aria-label="Copy password"
                      className="h-8 w-8 p-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-accent" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Copy</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={generatePassword}
                      aria-label="Generate new password"
                      className="h-8 w-8 p-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Generate</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="sr-only" aria-live="polite">
              {copied ? "Copied to clipboard" : ""}
            </span>
          </div>

          {/* Password Strength Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Password Strength
              </span>
              <Badge
                variant="secondary"
                className={`${strength.color} text-white`}
              >
                {strength.label}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${(strength.score / 6) * 100}%` }}
              />
            </div>
            {/* Entropy & Crack Time */}
            <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
              <span>Entropy: {estimate.bits} bits</span>
              <span>Online crack: ~{estimate.online}</span>
              <span>Offline crack: ~{estimate.offline}</span>
            </div>
            {/* Breach status */}
            <div className="flex items-center justify-between">
              <div className="text-xs">
                {breachStatus.state === "idle" && (
                  <span className="text-muted-foreground">
                    Breach check off
                  </span>
                )}
                {breachStatus.state === "checking" && (
                  <span className="text-muted-foreground">
                    Checking breaches…
                  </span>
                )}
                {breachStatus.state === "safe" && (
                  <span className="text-green-600 dark:text-green-400">
                    Not found in known breaches
                  </span>
                )}
                {breachStatus.state === "compromised" && (
                  <span className="text-red-600 dark:text-red-400">
                    Found in breaches ({breachStatus.count.toLocaleString()})
                  </span>
                )}
                {breachStatus.state === "error" && (
                  <span className="text-amber-600 dark:text-amber-400">
                    Breach check failed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="breach-check"
                  className="text-xs text-muted-foreground"
                >
                  Breach check
                </Label>
                <Switch
                  id="breach-check"
                  checked={breachCheckEnabled}
                  onCheckedChange={setBreachCheckEnabled}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Options */}
      <Card className="lg:self-start">
        <CardHeader>
          <CardTitle>Customize Your Password</CardTitle>
          <CardDescription>
            Adjust the settings below to create the perfect password for your
            needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Password Type</Label>
                <Badge variant="outline" className="ml-1">
                  {preset === "custom" ? "Custom" : "Preset"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="auto-generate"
                  className="text-sm text-muted-foreground"
                >
                  Auto-generate
                </Label>
                <Switch
                  id="auto-generate"
                  checked={autoGenerate}
                  onCheckedChange={setAutoGenerate}
                />
              </div>
            </div>
            <Select
              value={options.type}
              onValueChange={(value: "random" | "readable") =>
                setOptions((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random Characters</SelectItem>
                <SelectItem value="readable">Human Readable</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-sm">Preset</Label>
                <Select value={preset} onValueChange={(v) => applyPreset(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="nist-strong">
                      Strong (16+, all types)
                    </SelectItem>
                    <SelectItem value="no-symbols-16">
                      No symbols (16+)
                    </SelectItem>
                    <SelectItem value="passphrase-4w">
                      Passphrase (4+ words)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Compliance</Label>
                <div className="text-xs text-muted-foreground min-h-9 flex items-center">
                  {complianceIssues.length === 0 ? (
                    <span className="text-green-600 dark:text-green-400">
                      Meets suggested policy
                    </span>
                  ) : (
                    <span>Issues: {complianceIssues.join(", ")}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {options.type === "random" ? (
            <>
              {/* Length Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="length">Password Length</Label>
                  <Badge variant="outline">{options.length} characters</Badge>
                </div>
                <Slider
                  id="length"
                  min={4}
                  max={128}
                  step={1}
                  value={[options.length]}
                  onValueChange={(value) =>
                    setOptions((prev) => ({ ...prev, length: value[0] }))
                  }
                  className="w-full"
                />
              </div>

              {/* Character Type Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Include Characters
                </Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.includeUppercase}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({
                          ...prev,
                          includeUppercase: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="uppercase" className="flex-1">
                      Uppercase Letters (A-Z)
                    </Label>
                    <Badge variant="outline" className="font-mono">
                      ABC
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={options.includeLowercase}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({
                          ...prev,
                          includeLowercase: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="lowercase" className="flex-1">
                      Lowercase Letters (a-z)
                    </Label>
                    <Badge variant="outline" className="font-mono">
                      abc
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={options.includeNumbers}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({
                          ...prev,
                          includeNumbers: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="numbers" className="flex-1">
                      Numbers (0-9)
                    </Label>
                    <Badge variant="outline" className="font-mono">
                      123
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={options.includeSymbols}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({
                          ...prev,
                          includeSymbols: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="symbols" className="flex-1">
                      Symbols (!@#$%^&*)
                    </Label>
                    <Badge variant="outline" className="font-mono">
                      !@#
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-base font-medium">
                  Advanced Options
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeSimilar"
                    checked={options.excludeSimilar}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({
                        ...prev,
                        excludeSimilar: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="excludeSimilar" className="flex-1">
                    Exclude similar characters (i, l, 1, L, o, 0, O)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requireCoverage"
                    checked={!!options.requireCoverage}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({
                        ...prev,
                        requireCoverage: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="requireCoverage" className="flex-1">
                    Guarantee at least one of each selected type
                  </Label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Word List</Label>
                  <Select
                    value={selectedWordList}
                    onValueChange={(value: keyof typeof WORD_LISTS) =>
                      setSelectedWordList(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common Words</SelectItem>
                      <SelectItem value="animals">Animals</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wordCount">Number of Words</Label>
                    <Badge variant="outline">{options.wordCount} words</Badge>
                  </div>
                  <Slider
                    id="wordCount"
                    min={2}
                    max={8}
                    step={1}
                    value={[options.wordCount]}
                    onValueChange={(value) =>
                      setOptions((prev) => ({ ...prev, wordCount: value[0] }))
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="separator">Word Separator</Label>
                  <Select
                    value={options.separator}
                    onValueChange={(value) =>
                      setOptions((prev) => ({ ...prev, separator: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Hyphen (-)</SelectItem>
                      <SelectItem value="_">Underscore (_)</SelectItem>
                      <SelectItem value=".">Period (.)</SelectItem>
                      <SelectItem value=" ">Space ( )</SelectItem>
                      <SelectItem value="none">No Separator</SelectItem>{" "}
                      {/* Updated default value to be a non-empty string */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="capitalizeWords"
                      checked={options.capitalizeWords}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({
                          ...prev,
                          capitalizeWords: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="capitalizeWords" className="flex-1">
                      Capitalize first letter of each word
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeNumbersInWords"
                      checked={options.includeNumbersInWords}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({
                          ...prev,
                          includeNumbersInWords: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="includeNumbersInWords" className="flex-1">
                      Add numbers at the end
                    </Label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Generate Button */}
          <Button
            onClick={generatePassword}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Password
          </Button>
        </CardContent>
      </Card>

      {passwordHistory.length > 0 && (
        <Card className="order-2 lg:order-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Password History
                </CardTitle>
                <CardDescription>Recently generated passwords</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPasswordHistory([])}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {passwordHistory.map((historyPassword, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <code className="text-sm font-mono flex-1 truncate mr-2">
                    {historyPassword}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(historyPassword)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tips */}
      <Card className="order-3 lg:order-none">
        <CardHeader>
          <CardTitle className="text-lg">Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use a unique password for each account</li>
            <li>• Store passwords in a secure password manager</li>
            <li>• Enable two-factor authentication when available</li>
            <li>• Never share your passwords with others</li>
            <li>• Update passwords regularly for sensitive accounts</li>
            <li>
              • Human-readable passwords are easier to remember but may be less
              secure for high-risk accounts
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Bulk Generator */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bulk Generation</span>
          </CardTitle>
          <CardDescription>
            Generate multiple passwords and export
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="bulk-count">Count</Label>
              <Input
                id="bulk-count"
                type="number"
                min={1}
                max={500}
                value={bulkCount}
                onChange={(e) =>
                  setBulkCount(
                    Math.min(500, Math.max(1, Number(e.target.value)))
                  )
                }
                className="w-24"
              />
            </div>
            <Button
              onClick={() => {
                const list: string[] = [];
                for (let i = 0; i < bulkCount; i++) {
                  list.push(
                    options.type === "readable"
                      ? generateReadablePassword()
                      : generateRandomPassword()
                  );
                }
                setBulkPasswords(list);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Generate {bulkCount}
            </Button>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(bulkPasswords.join("\n"))}
              disabled={bulkPasswords.length === 0}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy all
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const csv = bulkPasswords
                  .map((p, i) => `${i + 1},"${p.replace(/"/g, '""')}"`)
                  .join("\n");
                const blob = new Blob([`index,password\n${csv}`], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "passwords.csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
              disabled={bulkPasswords.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          <Textarea
            value={bulkPasswords.join("\n")}
            readOnly
            rows={Math.min(12, Math.max(4, bulkPasswords.length))}
            placeholder="Generated passwords will appear here"
            className="font-mono"
          />
        </CardContent>
      </Card>
    </div>
  );
}
