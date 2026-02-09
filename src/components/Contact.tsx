import { Section } from "./Section";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  return (
    <Section id="contact" className="bg-muted/30">
      <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Let's Connect
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            I'm always open to discussing new projects, research collaborations,
            or opportunities in VLSI and AI.
          </p>

          <div className="space-y-6">
            <a
              href="mailto:dhruv83170@gmail.com"
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition"
            >
              <Mail className="w-6 h-6 text-primary" />
              <span>dhruv83170@gmail.com</span>
            </a>

            <a
              href="https://www.linkedin.com/in/dhruv-verma-34a927282/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition"
            >
              <Linkedin className="w-6 h-6 text-primary" />
              <span>LinkedIn</span>
            </a>

            <a
              href="https://github.com/dhruvv1101"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition"
            >
              <Github className="w-6 h-6 text-primary" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <Form {...form}>
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  Don’t fill this out: <input name="bot-field" />
                </label>
              </p>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} name="name" placeholder="Your name" />
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
                      <Input {...field} name="email" placeholder="your@email.com" />
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
                        {...field}
                        name="message"
                        placeholder="What's on your mind?"
                        className="min-h-[150px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </Form>
        </div>
      </div>
    </Section>
  );
}
