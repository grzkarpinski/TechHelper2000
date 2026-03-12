import { z } from "zod";

export const numberField = {
  setValueAs: (value) => (value === "" ? undefined : Number(value)),
};

export const millingSchema = z
  .object({
    vc: z.number().positive().optional(),
    n: z.number().positive().optional(),
    fz: z.number().positive().optional(),
    f: z.number().positive().optional(),
    d: z.number().positive(),
    z: z.number().int().positive(),
    ap: z.number().positive().optional(),
    ae: z.number().positive().optional(),
  })
  .superRefine((values, ctx) => {
    if ((values.vc == null) === (values.n == null)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Podaj dokladnie jedno z pol: Vc albo n", path: ["vc"] });
    }
    if ((values.fz == null) === (values.f == null)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Podaj dokladnie jedno z pol: Fz albo F", path: ["fz"] });
    }
  });

export const drillingSchema = z
  .object({
    vc: z.number().positive().optional(),
    n: z.number().positive().optional(),
    fn: z.number().positive().optional(),
    f: z.number().positive().optional(),
    d: z.number().positive(),
  })
  .superRefine((values, ctx) => {
    if ((values.vc == null) === (values.n == null)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Podaj dokladnie jedno z pol: Vc albo n", path: ["vc"] });
    }
    if ((values.fn == null) === (values.f == null)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Podaj dokladnie jedno z pol: fn albo F", path: ["fn"] });
    }
  });
