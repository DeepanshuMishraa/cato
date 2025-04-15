import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

const DowntimeAlert = ({ siteName,url }: { siteName: string,url:string }) => {
  return (
    <Html>
      <Tailwind>
        <Head>
          <title>Site Downtime Alert for {siteName}</title>
          <Preview>Your website {siteName} is currently down</Preview>
        </Head>
        <Body className="bg-[#0F172A] font-sans py-[40px]">
          <Container className="mx-auto max-w-[500px]">
            <Section className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-t-[12px] p-[32px] border-b-[3px] border-[#FF4757]">
              <Text className="text-[14px] text-[#94A3B8] uppercase tracking-[2px] m-0 mb-[8px]">
                Status Alert
              </Text>
              <Heading className="text-[28px] font-bold text-white m-0">
                Site is down
              </Heading>
            </Section>

            <Section className="bg-[#1E293B] p-[32px] rounded-b-[12px]">
              <Text className="text-[16px] text-white mb-[24px]">
                We've detected that <a href={url} className="font-bold text-[#38BDF8]">{siteName}</a> is currently unreachable.
              </Text>

              <Section className="bg-[#334155] rounded-[8px] p-[16px] mb-[24px]">
                <Text className="text-[14px] text-[#94A3B8] m-0">
                  <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#FF4757] mr-[8px]"></span>
                  Downtime detected at {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
                <Text className="text-[14px] text-[#94A3B8] m-0">
                  <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#FFB800] mr-[8px]"></span>
                  Monitoring continues
                </Text>
                <Text className="text-[14px] text-[#94A3B8] m-0">
                  <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#38BDF8] mr-[8px]"></span>
                  Automatic recovery checks in progress
                </Text>
              </Section>

              <Text className="text-[15px] text-[#CBD5E1] mb-[32px]">
                Our system will notify you when your site is back online. No action is required at this time.
              </Text>

              <Button
                className="bg-[#38BDF8] rounded-[6px] text-[#0F172A] font-bold py-[12px] px-[24px] no-underline text-center text-[14px] shadow-sm hover:bg-[#0EA5E9] box-border"
                href="https://cato.deepanshumishra.xyz"
              >
                View Status Dashboard
              </Button>

              <Text className="text-[13px] text-[#64748B] mt-[32px] mb-[8px]">
                Need help? Contact our support team:
              </Text>
              <Text className="text-[13px] text-[#38BDF8] m-0">
                <a href="mailto:support@cato.com" className="text-[#38BDF8] no-underline">support@cato.com</a>
              </Text>
            </Section>

            <Section className="mt-[24px] text-center">
              <Text className="text-[12px] text-[#64748B] m-0">
                © {new Date().getFullYear()} Cato Monitoring
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DowntimeAlert;
