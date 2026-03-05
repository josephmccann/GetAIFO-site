import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  companySize: z.string().optional(),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;

export default function EarlyAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      companySize: "",
    },
  });

  async function onSubmit(data: WaitlistValues) {
    setIsSubmitting(true);
    // Simulate API call for mockup mode
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Waitlist submission (mock):", data);
    
    toast({
      title: "Request received",
      description: "We'll be in touch shortly to schedule a conversation.",
    });
    
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <section id="early-access" className="section-padding border-t border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-label">EARLY ACCESS</span>
            <h2 className="text-6xl md:text-7xl text-white mb-6 leading-none">
              Join the waitlist.
            </h2>
            <p className="text-xl text-white/70 max-w-md">
              We're selecting 3–5 design partner organizations for early access. We'll reach out personally to schedule a conversation.
            </p>
          </div>

          <div className="card-dark max-w-md w-full ml-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Jane Doe" 
                          className="bg-black border-white/20 focus:border-accent text-white placeholder:text-white/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="jane@company.com" 
                          className="bg-black border-white/20 focus:border-accent text-white placeholder:text-white/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Company Size (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black border-white/20 focus:border-accent text-white">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-900 border-white/20 text-white">
                          <SelectItem value="under_1m">Under $1M</SelectItem>
                          <SelectItem value="1m_5m">$1M–$5M</SelectItem>
                          <SelectItem value="5m_20m">$5M–$20M</SelectItem>
                          <SelectItem value="20m_50m">$20m-$50M</SelectItem>
                          <SelectItem value="over_50m">Over $50M</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent-hover text-black font-bold h-12 text-lg"
                >
                  {isSubmitting ? "Submitting..." : "Request Access"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}