const { twMerge } = require("tailwind-merge");
const { clsx } = require("clsx");

function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

module.exports = { cn };
