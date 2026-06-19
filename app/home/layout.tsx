import { HomeLayout } from '@/views/home/layout/HomeLayout';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <HomeLayout>{children}</HomeLayout>;
}
