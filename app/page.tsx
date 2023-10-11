import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Group } from '@mantine/core';
import BeianFooter from '@/components/layout/BeianFooter';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: '只想优优',
  description: '只想优优主页，中国古诗词！'
}

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Group justify="center" mt="xl">
        <Button component='a' href='/home' variant="filled">主页</Button>
      </Group>
      <BeianFooter/>
    </>
  );
}
