
import { z } from "zod";
import { useState } from "react";

// Schema definitions
export const playerSchema = z.object({
  name: z.string().min(1, "Player name is required").max(50, "Player name is too long"),
  playerNumber: z.string().optional().transform(val => val === "" ? undefined : val)
    .pipe(
      z.string().regex(/^\d{1,3}$/, "Jersey number must be 1-3 digits").optional()
    ),
  parentEmail: z.string().optional().transform(val => val === "" ? undefined : val)
    .pipe(
      z.string().email("Invalid email format").optional()
    )
});

export const gameSchema = z.object({
  opponent_name: z.string().min(1, "Opponent name is required").max(50, "Name is too long"),
  game_date: z.date({
    required_error: "Game date is required",
  }),
  is_private: z.boolean().default(false),
  location: z.string().optional().transform(val => val === "" ? undefined : val)
});

export const statRecordSchema = z.object({
  playerId: z.string().min(1),
  statType: z.enum([
    'FG_Made', 'FG_Missed', 
    'ThreePT_Made', 'ThreePT_Missed', 
    'FT_Made', 'FT_Missed',
    'Assists', 'Rebounds', 'Steals', 'Blocks', 'Fouls'
  ]),
  value: z.number().int().default(1),
  gameId: z.string().min(1)
});

// Type extraction
export type PlayerFormValues = z.infer<typeof playerSchema>;
export type GameFormValues = z.infer<typeof gameSchema>;
export type StatRecordFormValues = z.infer<typeof statRecordSchema>;

// Custom hook for form validation
export function useFormValidation<T>(schema: z.ZodType<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (data: unknown): data is T => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            formattedErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };
  
  return { errors, validate, setErrors };
}

// Form validation helper to process form data
export function validateForm<T>(schema: z.ZodType<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: Record<string, string> 
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path.length > 0) {
          formattedErrors[err.path.join('.')] = err.message;
        }
      });
      return { success: false, errors: formattedErrors };
    }
    return { success: false, errors: { _form: 'Invalid form data' } };
  }
}
