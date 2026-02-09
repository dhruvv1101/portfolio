import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type ContactData = {
  name: string;
  email: string;
  message: string;
};

export function useContactSubmit() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ContactData) => {
      const res = await fetch("https://formspree.io/f/your_form_id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
