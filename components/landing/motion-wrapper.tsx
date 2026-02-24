"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

export const MotionSpan = React.forwardRef<
    HTMLSpanElement,
    HTMLMotionProps<"span">
>((props, ref) => <motion.span ref={ref} {...props} />);
MotionSpan.displayName = "MotionSpan";

export const MotionDiv = React.forwardRef<
    HTMLDivElement,
    HTMLMotionProps<"div">
>((props, ref) => <motion.div ref={ref} {...props} />);
MotionDiv.displayName = "MotionDiv";
