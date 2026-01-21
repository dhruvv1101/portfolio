import { Section } from "./Section";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, InsertMessage } from "@shared/schema";
import { useContactSubmit } from "@/hooks/use-contact";
import { Github, Linkedin, Mail, Send, Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  const mutation = useContactSubmit();

  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(data: InsertMessage) {
    mutation.mutate(data, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <Section id="contact" className="bg-muted/30">
      <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Let's Connect</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            I'm always open to discussing new projects, research collaborations, or opportunities in VLSI and AI.
            Feel free to drop a message or connect via social media.
          </p>

          <div className="space-y-6">
            <a 
              href="mailto:dhruv83170@gmail.com"
              className="flex items-center gap-4 text-foreground hover:text-primary transition-colors p-4 rounded-xl hover:bg-white/5"
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-muted-foreground">dhruv83170@gmail.com</p>
              </div>
            </a>

            <a 
              href="https://www.linkedin.com/in/dhruv-verma-34a927282/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 text-foreground hover:text-primary transition-colors p-4 rounded-xl hover:bg-white/5"
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Linkedin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">LinkedIn</p>
                <p className="text-muted-foreground">dhruv-verma-34a927282</p>
              </div>
            </a>

            <a 
              href="https://github.com/dhruvv1101"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 text-foreground hover:text-primary transition-colors p-4 rounded-xl hover:bg-white/5"
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">GitHub</p>
                <p className="text-muted-foreground">dhruvv1101</p>
              </div>
            </a>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your name" 
                        {...field} 
                        className="bg-background/50 border-white/10 focus:border-primary/50" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your@email.com" 
                        {...field} 
                        className="bg-background/50 border-white/10 focus:border-primary/50" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What's on your mind?" 
                        className="min-h-[150px] bg-background/50 border-white/10 focus:border-primary/50 resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Send Message
                  </>
                )}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </Section>
  );
}
