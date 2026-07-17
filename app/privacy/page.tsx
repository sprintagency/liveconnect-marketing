import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How LiveConnect collects, uses, and shares information in the LiveConnect app and website, and the choices and rights you have over your data.",
  openGraph: {
    title: "Privacy Policy",
    description:
      "How LiveConnect handles your data in the app and on the website.",
    url: "https://liveconnectusa.com/privacy",
    type: "article",
  },
};

const PRIVACY_EMAIL = "hello@liveconnectusa.com";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-11">
      <h2 className="font-display text-[23px] font-normal tracking-[-0.4px] text-ink-text md:text-[27px]">
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-[16px] leading-[1.62] text-body">
        {children}
      </div>
    </section>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex list-disc flex-col gap-[10px] pl-5 marker:text-teal">
      {children}
    </ul>
  );
}

function Term({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-ink-text">{children}</span>;
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-cream">
        <header className="border-b border-border">
          <div className="mx-auto max-w-[760px] px-5 pb-10 pt-16 md:px-7 md:pt-20">
            <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal-dark">
              LEGAL
            </div>
            <h1 className="mt-3 font-display text-[34px] font-normal leading-[1.1] tracking-[-1px] text-ink-text md:text-[44px]">
              Privacy Policy
            </h1>
            <p className="mt-4 text-[15px] text-muted-2">
              Last updated July 17, 2026
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-[760px] px-5 pb-24 pt-8 md:px-7">
          <div className="flex flex-col gap-4 text-[16px] leading-[1.62] text-body">
            <p>
              This Privacy Policy explains how LiveConnect (
              <Term>LiveConnect</Term>, <Term>we</Term>, <Term>us</Term>, or{" "}
              <Term>our</Term>) collects, uses, and shares information when you
              use the LiveConnect mobile app, our website, and related services
              (the <Term>Services</Term>). LiveConnect is a live networking app
              that helps you see who is in the room at an event, find the people
              who matter, and connect or save their details in a single tap.
            </p>
          </div>

          <Section title="Information we collect">
            <List>
              <li>
                <Term>Account information.</Term> When you create an account we
                collect your name, email address, and a password, which is
                handled by our authentication provider.
              </li>
              <li>
                <Term>Profile information.</Term> Details you choose to add to
                your networking profile, such as a photo, job title, company,
                bio, and links. This information is shown to other attendees in
                the rooms you join.
              </li>
              <li>
                <Term>Connection and activity data.</Term> The connections you
                make, contacts you save, profile cards you exchange, and your
                interactions within an event.
              </li>
              <li>
                <Term>Event data.</Term> The events and rooms you join, your
                check-in status, and attendance.
              </li>
              <li>
                <Term>Device and usage data.</Term> Device type, operating
                system, app version, IP address, and log and diagnostic data
                used to operate and secure the Services.
              </li>
              <li>
                <Term>Communications.</Term> Messages you send us, for example
                through our contact form or support requests.
              </li>
            </List>
            <p>
              We associate you with the events and venues you choose to join. We
              do not collect precise (GPS) location from your device unless a
              feature you enable requires it and you grant permission.
            </p>
          </Section>

          <Section title="How we use information">
            <List>
              <li>
                Provide, operate, and maintain the Services, including showing
                you who is in the room and helping you connect.
              </li>
              <li>Create and manage your account and profile.</li>
              <li>
                Compute a SignalScore, our high-level measure of the quality of
                connection at an event, from your in-app activity.
              </li>
              <li>
                Communicate with you about the Services, including support and
                important notices.
              </li>
              <li>
                Secure the Services, prevent fraud and abuse, and diagnose and
                fix problems.
              </li>
              <li>Comply with legal obligations.</li>
            </List>
          </Section>

          <Section title="How we share information">
            <List>
              <li>
                <Term>With other attendees.</Term> The core purpose of
                LiveConnect is to make you visible to other people in the rooms
                you join. Your profile and the details you choose to share are
                shown to other attendees in that room. You control what appears
                on your profile.
              </li>
              <li>
                <Term>With event organizers.</Term> Events are often run as
                white-label rooms by organizers. The organizer of an event you
                join may see attendance and aggregate engagement for their
                event.
              </li>
              <li>
                <Term>With service providers.</Term> We use trusted third
                parties to host and operate the Services, including cloud
                hosting and database, authentication, and email delivery. They
                process information on our behalf under contract.
              </li>
              <li>
                <Term>For legal reasons.</Term> We may disclose information if
                required by law or to protect the rights, safety, and security
                of our users and the Services.
              </li>
              <li>
                <Term>Business transfers.</Term> If LiveConnect is involved in a
                merger, acquisition, or sale of assets, information may be
                transferred as part of that transaction.
              </li>
            </List>
            <p>
              <Term>We do not sell your personal information.</Term>
            </p>
          </Section>

          <Section title="Data retention">
            <p>
              We keep your information for as long as your account is active or
              as needed to provide the Services. When you delete your account,
              we delete or de-identify your personal information within a
              reasonable period, except where we must retain it to meet legal,
              security, or accounting requirements.
            </p>
          </Section>

          <Section title="Your choices and rights">
            <List>
              <li>
                <Term>Access and update.</Term> You can view and edit your
                profile information in the app at any time.
              </li>
              <li>
                <Term>Delete your account.</Term> You can delete your account
                and its associated personal data from within the app, in your
                account settings. You can also email us at{" "}
                <a
                  href={`mailto:${PRIVACY_EMAIL}`}
                  className="font-medium text-teal-dark underline underline-offset-2 hover:text-teal"
                >
                  {PRIVACY_EMAIL}
                </a>{" "}
                and we will process the deletion.
              </li>
              <li>
                <Term>Additional rights.</Term> Depending on where you live, you
                may have rights to access, correct, delete, or port your
                information, or to object to certain processing. Contact us to
                exercise them.
              </li>
              <li>
                <Term>Device permissions.</Term> You can control permissions
                such as notifications and camera access in your device settings.
              </li>
            </List>
          </Section>

          <Section title="Security">
            <p>
              We use technical and organizational measures designed to protect
              your information, including encryption in transit and access
              controls. No method of transmission or storage is completely
              secure, so we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="Children">
            <p>
              The Services are not directed to children under 13, or the minimum
              age required in your country, and we do not knowingly collect
              personal information from them. If you believe a child has
              provided us personal information, please contact us and we will
              delete it.
            </p>
          </Section>

          <Section title="International users">
            <p>
              We operate in the United States. If you access the Services from
              outside the United States, your information may be processed and
              stored in the United States, where data protection laws may differ
              from those in your country.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we
              will post the updated version here and revise the date above.
              Material changes may also be communicated in the app.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              If you have questions about this Privacy Policy or how we handle
              your information, contact us at{" "}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="font-medium text-teal-dark underline underline-offset-2 hover:text-teal"
              >
                {PRIVACY_EMAIL}
              </a>
              .
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
