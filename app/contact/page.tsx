import { ContactForm } from "@/components/Forms";
import { site } from "@/data/config";
import { showPlaceholders } from "@/data/content";
import "@/styles/product.css";
import "@/styles/home.css";
export const metadata = { title: "Contact", description: "Get in touch with LOVE CANDLE on WhatsApp, email or Instagram." };
export default function Contact() {
  return (
    <div className="wrap fade">
      <div className="pg-head"><p className="eyebrow">Contact</p><h1>Say hello.</h1><p className="lede">Questions about a scent, an order or a gift? Write to us and we’ll reply on WhatsApp.</p></div>
      <div className="two" style={{ alignItems: "start" }}>
        <ContactForm />
        <div>
          <h2 style={{ fontSize: "2rem" }}>Reach us</h2>
          <dl className="contact">
            <dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd>
            <dt>WhatsApp</dt><dd><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">+{site.whatsapp}</a></dd>
            <dt>Instagram</dt><dd><a href={site.instagram} target="_blank" rel="noopener noreferrer">Follow us</a></dd>
          </dl>
          {showPlaceholders && <p className="note">Shipping, return and privacy policy text goes here once written. Business enquiries are welcome through the form.</p>}
        </div>
      </div>
    </div>
  );
}
