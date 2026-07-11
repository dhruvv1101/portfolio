import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "./Section";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const channels = [
  {
    label: "Mail",
    value: "dhruv83170@gmail.com",
    href: "mailto:dhruv83170@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "dhruv-verma-34a927282",
    href: "https://www.linkedin.com/in/dhruv-verma-34a927282/",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    value: "dhruvv1101",
    href: "https://github.com/dhruvv1101",
    icon: Github,
  },
];

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
    <Section
      id="contact"
      label="06 / Let's Talk"
      title="If the work feels aligned, reach out."
      kicker="I’m open to internships, research-heavy builds, backend/product systems work, and conversations that are actually specific."
      intro="contact / collab / opportunities"
      folio="Close"
      backgroundText="contact / collaboration / internships / research / backend systems / product builds / opportunities"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="editorial-card px-5 py-6 sm:px-6 sm:py-7">
          <p className="folio-tag mb-6">Channels</p>
          <div className="space-y-5">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-start gap-4 border-b border-border/70 pb-5 last:border-b-0 last:pb-0"
              >
                <channel.icon className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{channel.label}</p>
                    <p className="fluid-body mt-2 text-foreground">{channel.value}</p>
                  </div>
                </a>
              ))}
          </div>
        </div>

        <div className="editorial-card px-5 py-6 sm:px-6 sm:py-7">
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

              <div className="border-b border-border/70 pb-4">
                <p className="folio-tag">Send a note</p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        name="name"
                        placeholder="Your name"
                        className="rounded-none border-border/80 bg-background/70 px-4 py-6"
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
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        name="email"
                        placeholder="your@email.com"
                        className="rounded-none border-border/80 bg-background/70 px-4 py-6"
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
                    <FormLabel className="text-muted-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        name="message"
                        placeholder="What are we building, fixing, or figuring out?"
                        className="min-h-[170px] rounded-none border-border/80 bg-background/70 px-4 py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground px-5 py-3 text-[0.78rem] uppercase tracking-[0.2em] text-background transition hover:bg-primary hover:text-primary-foreground sm:px-6 sm:py-4 sm:text-sm sm:tracking-[0.25em]"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </Form>
        </div>
      </div>
    </Section>
  );
}
