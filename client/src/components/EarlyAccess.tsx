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
  accountingSystem: z.string().optional(),
  companyWebsite: z.string().optional(),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;

function ContactRow() {
  return (
    <div className="mt-8 pt-6 border-t border-[rgba(30,39,97,0.15)]">
      <p className="text-muted-foreground text-sm font-medium mb-3">Contact</p>
      <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 text-sm text-muted-foreground">
        <span>Product feedback: <a href="mailto:product@getaifo.com" className="hover:text-accent transition-colors">product@getaifo.com</a></span>
        <span>Early access / pilots: <a href="mailto:sales@getaifo.com" className="hover:text-accent transition-colors">sales@getaifo.com</a></span>
        <span>Investor inquiries: <a href="mailto:investors@getaifo.com" className="hover:text-accent transition-colors">investors@getaifo.com</a></span>
      </div>
    </div>
  );
}

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
      accountingSystem: "",
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

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        setIsSuccess(true);
      } else if (res.status === 429) {
        setErrorMessage("rate-limit");
      } else if (res.status === 400) {
        setErrorMessage("validation");
      } else {
        setErrorMessage(json.error || "generic");
      }
    } catch {
      setErrorMessage("connection-error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="early-access" className="section-padding border-t border-[rgba(30,39,97,0.12)] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-label">EARLY ACCESS</span>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-foreground mb-6 leading-none">
              Join the first cohort.
            </h2>
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground max-w-md mb-12">
              We are onboarding a small group of organizations to use AI.FO on their real financial data. You get full product access, direct input on what we build next, and a founding-team relationship.
            </p>

            <div className="max-w-xl">
              <p className="text-foreground mb-2">
                Not a waitlist. Not a demo request. You get the actual product.
              </p>
              <p className="text-muted-foreground text-sm">
                Questions? Contact{" "}
                <a href="mailto:sales@getaifo.com" className="hover:text-accent transition-colors underline underline-offset-2">sales@getaifo.com</a>.
              </p>
            </div>
          </div>

          <div className="max-w-md w-full ml-auto">
            <div className="card-dark min-h-[400px] flex flex-col justify-center">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-display text-3xl text-white mb-3">Request Received</h3>
                  <p className="text-white/80">
                    You're on the list. We'll reach out to schedule early access.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <fieldset disabled={isSubmitting} className="space-y-6 border-0 p-0 m-0 disabled:opacity-70">
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
                          <FormLabel className="text-white/85 font-medium">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Jane Doe"
                              className="bg-[#253070] border-white/20 focus-visible:ring-accent focus-visible:border-accent text-white placeholder:text-white/40 h-12"
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
                          <FormLabel className="text-white/85 font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jane@company.com"
                              className="bg-[#253070] border-white/20 focus-visible:ring-accent focus-visible:border-accent text-white placeholder:text-white/40 h-12"
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
                          <FormLabel className="text-white/85 font-medium">Annual Revenue (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#253070] border-white/20 focus:ring-accent text-white h-12">
                                <SelectValue placeholder="Select size" className="text-white/75" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#253070] border-white/20 text-white">
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

                    <FormField
                      control={form.control}
                      name="accountingSystem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/85 font-medium">Accounting System (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#253070] border-white/20 focus:ring-accent text-white h-12">
                                <SelectValue placeholder="Select system" className="text-white/75" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#253070] border-white/20 text-white">
                              <SelectItem value="quickbooks" className="focus:bg-accent/20 focus:text-accent">QuickBooks</SelectItem>
                              <SelectItem value="xero" className="focus:bg-accent/20 focus:text-accent">Xero</SelectItem>
                              <SelectItem value="netsuite" className="focus:bg-accent/20 focus:text-accent">NetSuite</SelectItem>
                              <SelectItem value="sage" className="focus:bg-accent/20 focus:text-accent">Sage</SelectItem>
                              <SelectItem value="freshbooks" className="focus:bg-accent/20 focus:text-accent">FreshBooks</SelectItem>
                              <SelectItem value="wave" className="focus:bg-accent/20 focus:text-accent">Wave</SelectItem>
                              <SelectItem value="other" className="focus:bg-accent/20 focus:text-accent">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />

                    {errorMessage && (
                      <p className="text-sm text-red-400 font-medium" role="alert">
                        {errorMessage === "connection-error" && (
                          <>Connection error. Please check your network and try again, or email{" "}
                            <a href="mailto:questions@getaifo.com" className="underline underline-offset-2 hover:text-accent transition-colors">questions@getaifo.com</a>.</>
                        )}
                        {errorMessage === "rate-limit" && (
                          <>Too many requests from this network. Please wait a few minutes and try again.</>
                        )}
                        {errorMessage === "validation" && (
                          <>Please double-check your name and email and try again.</>
                        )}
                        {errorMessage !== "connection-error" && errorMessage !== "rate-limit" && errorMessage !== "validation" && (
                          <>Something went wrong. Please try again or email{" "}
                            <a href="mailto:questions@getaifo.com" className="underline underline-offset-2 hover:text-accent transition-colors">questions@getaifo.com</a>.</>
                        )}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-accent-hover text-white font-bold h-12 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : "Get Started"}
                    </Button>
                    </fieldset>
                  </form>
                </Form>
              )}
            </div>

            <ContactRow />
          </div>
        </div>
      </div>
    </section>
  );
}