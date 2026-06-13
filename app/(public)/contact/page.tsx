import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Maitbhanga Alumni Forum',
  description: 'Get in touch with the Maitbhanga High School Alumni Forum. We are here to help.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="bg-gradient-hero py-16 text-white">
        <div className="page-container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg">Have a question? We'd love to hear from you.</p>
        </div>
      </div>
      <div className="page-container section-padding">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold font-heading text-foreground mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {[
                { label: 'Address', value: 'Maitbhanga High School, Sandwip, Chattogram, Bangladesh' },
                { label: 'Email', value: 'info@maitbhangaalumni.org' },
                { label: 'Phone', value: '+880 1700-000000' },
                { label: 'Office Hours', value: 'Saturday–Thursday, 9AM–5PM BST' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Contact form */}
          <div className="card-base p-8">
            <h3 className="font-heading font-bold text-foreground text-xl mb-5">Send a Message</h3>
            <form className="space-y-4" action="/api/contact" method="POST">
              <input type="text" name="name" placeholder="Your Full Name" className="input-base" required />
              <input type="email" name="email" placeholder="Your Email Address" className="input-base" required />
              <input type="text" name="subject" placeholder="Subject" className="input-base" required />
              <textarea name="message" placeholder="Your Message" rows={5} className="input-base resize-none" required />
              <button type="submit" className="btn-primary w-full justify-center">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
