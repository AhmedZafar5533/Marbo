import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        reason: '',
        message: '',
        otherReason: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update form data
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Validate email as the user types
        if (name === 'email') {
            if (!emailRegex.test(value)) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
            } else {
                setErrors(prev => {
                    const { email, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Final check before submit
        if (!emailRegex.test(formData.email)) {
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
            return;
        }
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
    };

    const reasonOptions = [
        { value: '', label: 'Select a reason' },
        { value: 'support', label: 'Technical Support' },
        { value: 'billing', label: 'Billing Inquiry' },
        { value: 'feedback', label: 'Product Feedback' },
        { value: 'partnership', label: 'Partnership Opportunity' },
        { value: 'other', label: 'Other' }
    ];

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-indigo-100">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
                            <svg className="h-8 w-8 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-800">Thank you!</h2>
                        <p className="mt-3 text-lg text-gray-600">Your message has been sent successfully. We'll get back to you soon.</p>
                        <button
                            onClick={() => {
                                setFormData({ email: '', reason: '', message: '', otherReason: '' });
                                setIsSubmitted(false);
                            }}
                            className="mt-8 px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition duration-300 shadow-lg hover:shadow-xl"
                        >
                            Send another message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-10">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-indigo-100">
                <div className="flex flex-col md:flex-row md:items-center mb-12">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                        <div className="h-16 w-16 bg-indigo-700 rounded-2xl flex items-center justify-center mb-4 transform rotate-6 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
                        <p className="text-lg text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8">
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-700 transition duration-200">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-indigo-500 focus:border-indigo-700 transition duration-200 focus:outline-none"
                                    placeholder="your@email.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div className="group">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-700 transition duration-200">
                                Reason for Contact
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <select
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-indigo-500 focus:border-indigo-700 transition duration-200 bg-white appearance-none"
                                    style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"%234B5563\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
                                >
                                    {reasonOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formData.reason === 'other' && (
                            <div className="group -mt-4">
                                <label htmlFor="otherReason" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-700 transition duration-200">
                                    Please specify
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="otherReason"
                                        name="otherReason"
                                        value={formData.otherReason}
                                        onChange={handleChange}
                                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-indigo-500 focus:border-indigo-700 transition duration-200"
                                        placeholder="Please tell us more"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-700 transition duration-200">
                                Your Message
                            </label>
                            <div className="relative">
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-indigo-500 focus:border-indigo-700 transition duration-200 resize-none focus:outline-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full py-4 px-6 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Send Message
                        </button>
                        <p className="text-center text-gray-500 text-sm mt-4">
                            We'll get back to you within 24-48 hours
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
