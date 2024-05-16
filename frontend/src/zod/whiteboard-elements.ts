import {z} from 'zod';

export const WhiteboardElement = z.object({
  tool: z.string(),
  offsetX: z.number(),
  offsetY: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  path:z.array(z.array(z.number())).optional(),
  stroke: z.string().default('black'),
  strokeWidth:z.number().default(1),
});

export const whiteBoardRecord = z.record(WhiteboardElement);

export type WhiteboardElementType = z.infer<typeof WhiteboardElement>;