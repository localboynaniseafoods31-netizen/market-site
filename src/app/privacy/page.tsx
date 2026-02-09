import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';

export const metadata: Metadata = {
    title: `Privacy Policy - ${SITE_NAME}`,
    description: 'Privacy Policy for Localboynaniseafoods. How we collect, use, and protect your data.',
    robots: 'noindex, follow' // Legal pages don't need to be indexed primarily
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 31, 2025</p>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h3>1. Introduction</h3>
                    <p>
                        Welcome to {SITE_NAME}. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights.
                    </p>

                    <h3>2. Data We Collect</h3>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                    <ul>
                        <li><strong>Identity Data:</strong> name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Transaction Data:</strong> details about payments to and from you and other details of products you have purchased from us.</li>
                    </ul>

                    <h3>3. How We Use Your Data</h3>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul>
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., delivering your order).</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests.</li>
                    </ul>

                    <h3>4. Data Security</h3>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way.
                    </p>
                </div>
            </div>
        </main>
    );
}
