type FormLabelProps = {
    htmlFor?: string;
    children: React.ReactNode;
};

function FormLabel({ htmlFor, children }: FormLabelProps) {
    return (
        <label htmlFor={htmlFor} className="block text-base font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
            {children}
        </label>
    );
}

export default FormLabel;