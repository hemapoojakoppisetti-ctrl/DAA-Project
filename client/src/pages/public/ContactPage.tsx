import React, { useState, FormEvent } from 'react';
import { submitContact } from '../../utils/api';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage()  {

  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      toast.success('Message sent successfully! We will get back to you soon.');
      setSent(true);
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof ContactForm, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Contact Us
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Have questions about academic processes, admissions, or need support? Reach out to the DAA team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Info */}
        <div className="space-y-5">

          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Address</h3>
              <address className="not-italic text-sm text-gray-600 leading-relaxed">
                JNTUK Administrative Office<br />
                Kakinada - 533003<br />
                Andhra Pradesh, India
              </address>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Phone</h3>
              <p className="text-sm text-gray-600">0884-2300800</p>
              <p className="text-sm text-gray-600">0884-2300801</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Email</h3>
              <a href="mailto:info@jntuk.edu.in" className="text-sm text-primary-600 hover:underline">
                info@jntuk.edu.in
              </a><br />
              <a href="mailto:vc@jntuk.edu.in" className="text-sm text-primary-600 hover:underline">
                vc@jntuk.edu.in
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Working Hours</h3>
              <p className="text-sm text-gray-600">Mon – Fri: 9:00 AM – 5:00 PM</p>
              <p className="text-sm text-gray-500">Saturday: 9:00 AM – 1:00 PM</p>
            </div>
          </div>

        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-display font-bold text-green-800 text-xl mb-2">
                Message Sent!
              </h3>
              <p className="text-green-600 mb-4">
                Thank you for reaching out. Our team will respond within 1-2 business days.
              </p>
              <button onClick={() => setSent(false)} className="btn-primary mx-auto">
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      className="input"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="label">Email Address *</label>
                    <input
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      className="input"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="+91 xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="label">Subject *</label>
                    <select
                      className="input"
                      value={form.subject}
                      onChange={e => set('subject', e.target.value)}
                      required
                    >
                      <option value="">Select subject...</option>
                      {[
                        'Admissions Inquiry',
                        'Examination Related',
                        'Fee Payment',
                        'Certificate/Transcript',
                        'Technical Support',
                        'Accreditation Related',
                        'General Inquiry',
                        'Other'
                      ].map((s: string) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    className="input resize-none"
                    rows={5}
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    required
                    placeholder="Describe your query in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3 text-base"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}