import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
}>({ open: false, onOpenChange: () => { } })

export const Dialog = ({ children, open, onOpenChange }: any) => {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            <AnimatePresence>{open && children}</AnimatePresence>
        </DialogContext.Provider>
    )
}

import { createPortal } from "react-dom"

export const DialogContent = ({ children, className }: any) => {
    const { onOpenChange } = React.useContext(DialogContext)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 shadow-2xl overflow-y-auto backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn("relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg my-auto", className)}
            >
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </motion.div>
        </div>,
        document.body
    )
}

export const DialogHeader = ({ className, ...props }: any) => (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)

export const DialogFooter = ({ className, ...props }: any) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)

export const DialogTitle = ({ className, ...props }: any) => (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
)

export const DialogDescription = ({ className, ...props }: any) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)
