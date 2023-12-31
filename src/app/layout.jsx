import CredentialsProvider from '../store/Credentials';
import './index.css';

export const metadata = {
  title: 'Trade Torto',
  description: 'Created by Torto Systems',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <CredentialsProvider>
        <body>
          {children}
        </body>
      </CredentialsProvider>
    </html>
  )
}
