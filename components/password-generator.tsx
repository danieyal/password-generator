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
import { Copy, RefreshCw, Shield, Check, History, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

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
  });
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [selectedWordList, setSelectedWordList] =
    useState<keyof typeof WORD_LISTS>("common");
  const [autoGenerate, setAutoGenerate] = useState<boolean>(true);

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
      if (storedOptions) setOptions(JSON.parse(storedOptions));
      if (storedHistory) setPasswordHistory(JSON.parse(storedHistory));
      if (storedPassword) setPassword(storedPassword);
      if (storedWordList && WORD_LISTS[storedWordList])
        setSelectedWordList(storedWordList);
      if (storedAuto !== null) setAutoGenerate(storedAuto === "true");
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

    let result = "";
    const array = new Uint8Array(options.length);
    crypto.getRandomValues(array);

    for (let i = 0; i < options.length; i++) {
      result += charset[array[i] % charset.length];
    }

    return result;
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
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Password Type</Label>
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
    </div>
  );
}
