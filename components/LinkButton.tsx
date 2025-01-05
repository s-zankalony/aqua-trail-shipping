// 'use client';
import Link from 'next/link';

type BookingButtonProps = {
  reference: string;
  text: string;
};

function LinkButton({ text, reference }: BookingButtonProps) {
  return (
    <Link href={`/${reference}`} className="btn btn-primary font-bold">
      {text}
    </Link>
  );
}
export default LinkButton;
