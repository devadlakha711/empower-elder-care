import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { toast } from "./use-toast";
import { DashboardCard } from "./DashboardCard";

// Define the form schema with zod
const feedbackFormSchema = z.object({
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  category: z.enum(["general", "training", "placement", "technical", "other"], {
    required_error: "Please select a category.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please provide a rating.",
  }),
  contactPreference: z.enum(["email", "phone", "none"], {
    required_error: "Please select a contact preference.",
  }),
  attachments: z.any().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  onSubmitFeedback?: (data: FeedbackFormValues) => Promise<void>;
  defaultCategory?: z.infer<typeof feedbackFormSchema>["category"];
  title?: string;
  description?: string;
  className?: string;
}

export function FeedbackForm({
  onSubmitFeedback,
  defaultCategory = "general",
  title = "Submit Feedback",
  description = "Share your thoughts or report issues. We appreciate your feedback.",
  className,
}: FeedbackFormProps) {
  // Initialize the form
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      subject: "",
      category: defaultCategory,
      message: "",
      rating: "3",
      contactPreference: "none",
    },
  });

  // Handle form submission
  async function onSubmit(data: FeedbackFormValues) {
    try {
      if (onSubmitFeedback) {
        await onSubmitFeedback(data);
      } else {
        // Default behavior if no custom handler is provided
        console.log("Feedback submitted:", data);
      }
      
      // Reset the form
      form.reset();
      
      // Show success message
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback. We'll review it shortly.",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <DashboardCard 
      title={title} 
      description={description}
      className={className}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Brief subject of your feedback" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="placement">Placement</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                    placeholder="Provide details about your feedback or issue"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem
                        key={rating}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {rating}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Rate your experience from 1 (poor) to 5 (excellent)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Contact Preference</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="email" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Contact me by email
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="phone" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Contact me by phone
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No need to contact me
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </Form>
    </DashboardCard>
  );
} 
