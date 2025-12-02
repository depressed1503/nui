import { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

export default function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  return <Form.Check type={"checkbox"} ref={ref} {...rest} />;
}
