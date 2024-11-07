"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Copy, Wallet as WalletIcon } from "lucide-react";
import { generateCustomWallet } from '@/lib/generateWallet';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [suffix, setSuffix] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    address: string;
    privateKey: string;
    attempts: number;
  } | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!suffix) {
      toast({
        title: "Error",
        description: "Please enter a suffix",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const wallet = await generateCustomWallet(suffix);
      setResult(wallet);
      toast({
        title: "Success!",
        description: `Found matching wallet after ${wallet.attempts} attempts`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate wallet",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: 'address' | 'privateKey') => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type === 'address' ? 'Address' : 'Private key'} copied to clipboard`,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-2xl mx-auto space-y-8 pt-12">
        <div className="text-center space-y-4">
          <WalletIcon className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Custom Wallet Generator</h1>
          <p className="text-muted-foreground text-lg">
            Generate Ethereum wallet addresses ending with your desired pattern
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="suffix" className="text-sm font-medium">
                Enter desired suffix (e.g., "maga")
              </label>
              <div className="flex gap-2">
                <Input
                  id="suffix"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="Enter suffix..."
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !suffix}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>

            {result && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Wallet Address</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.address, 'address')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-lg break-all font-mono text-sm">
                    {result.address}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Private Key</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.privateKey, 'privateKey')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-lg break-all font-mono text-sm">
                    {result.privateKey}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Generated in {result.attempts} attempts
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>⚠️ Never share your private key with anyone!</p>
          <p>Store it securely and keep it private.</p>
        </div>
      </div>
    </main>
  );
}