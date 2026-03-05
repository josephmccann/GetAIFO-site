import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  companySize: z.string().optional(),
  companyWebsite: z.string().optional(),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;

export default function EarlyAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      companySize: "",
      companyWebsite: "",
    },
  });

  async function onSubmit(data: WaitlistValues) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.ok) {
        setIsSuccess(true);
      } else {
        setErrorMessage(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setErrorMessage("Could not connect. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="early-access" className="section-padding border-t border-white/10 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-label">EARLY ACCESS</span>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-none">
              Join the waitlist.
            </h2>
            <p className="font-body text-base md:text-lg leading-relaxed text-white/70 max-w-md">
              We're selecting 3–5 design partner organizations for early access. We'll reach out personally to schedule a conversation.
            </p>
          </div>

          <div className="card-dark max-w-md w-full ml-auto min-h-[400px] flex flex-col justify-center">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display text-3xl text-white mb-3">Request Received</h3>
                <p className="text-white/70">
                  You're on the list. We'll reach out to schedule early access.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="hidden" aria-hidden="true">
                    <FormField
                      control={form.control}
                      name="companyWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input tabIndex={-1} autoComplete="off" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane Doe"
                            className="bg-black border-white/20 focus-visible:ring-accent focus-visible:border-accent text-white placeholder:text-white/20 h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="jane@company.com"
                            className="bg-black border-white/20 focus-visible:ring-accent focus-visible:border-accent text-white placeholder:text-white/20 h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Company Size (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black border-white/20 focus:ring-accent text-white h-12">
                              <SelectValue placeholder="Select size" className="text-white/70" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-900 border-white/20 text-white">
                            <SelectItem value="under_1m" className="focus:bg-accent/20 focus:text-accent">Under $1M</SelectItem>
                            <SelectItem value="1m_5m" className="focus:bg-accent/20 focus:text-accent">$1M–$5M</SelectItem>
                            <SelectItem value="5m_20m" className="focus:bg-accent/20 focus:text-accent">$5M–$20M</SelectItem>
                            <SelectItem value="20m_50m" className="focus:bg-accent/20 focus:text-accent">$20M–$50M</SelectItem>
                            <SelectItem value="over_50m" className="focus:bg-accent/20 focus:text-accent">Over $50M</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-destructive font-medium" />
                      </FormItem>
                    )}
                  />

                  {errorMessage && (
                    <p className="text-sm text-red-400 font-medium">{errorMessage}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent-hover text-black font-bold h-12 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : "Join Early Access"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}