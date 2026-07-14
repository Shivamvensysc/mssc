import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../layout/Footer';
import Header from '../layout/Header';

interface RegistrationFormData {
  name: string;
  citizen: string;
  dialect: string;
  residencyConfirmed: boolean;
  gender: string;
  maritalStatus: string;
  reservationCategory: string;
  ph: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  mobile: string;
  email: string;
  district: string;
  captchaInput: string;
  govEmployee: string;
}

interface RegistrationFormErrors {
  mobile?: string;
}

const initialFormData: RegistrationFormData = {
  name: '',
  citizen: '',
  dialect: '',
  residencyConfirmed: false,
  gender: '',
  maritalStatus: '',
  reservationCategory: '',
  ph: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  mobile: '',
  email: '',
  district: '',
  captchaInput: '',
  govEmployee: '',
};

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, i) => String(currentYear - i));

export default function RegistrationForm() {
  const [captcha] = useState("1 8 1 8 M 7");
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  
  // ADDED: State to track dynamic work experience rows
  const [workExperienceRows, setWorkExperienceRows] = useState([1]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, mobile: value }));

    if (value === '') {
      setErrors((prev) => ({ ...prev, mobile: undefined }));
    } else if (value.startsWith('0') || value.startsWith('+91') || value.startsWith('91')) {
      setErrors((prev) => ({ ...prev, mobile: "Do not prefix '0' or '+91' before the mobile no." }));
    } else if (!/^\d{10}$/.test(value)) {
      setErrors((prev) => ({ ...prev, mobile: 'Enter a valid 10-digit mobile number.' }));
    } else {
      setErrors((prev) => ({ ...prev, mobile: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    console.log('Final Application submitted:', formData);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  const stepNames = ['Registration', 'Application', 'Payment', 'Completed'];

  return (
    <div className="bg-background min-h-screen font-body-md text-on-surface">
      
      <Header />

      {/* 2. Hero Section */}
      <header className="pt-24 pb-48 hero-gradient relative overflow-hidden">
        {currentStep === 2 && (
          <div className="absolute top-10 left-10 opacity-10">
             
          </div>
        )}
        
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center text-white relative z-10">
          
          <h1 className="text-6xl font-bold text-white mb-6">
            {currentStep === 1 ? 'Request a Quote & Registration' : 'Application Form'}
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            {currentStep === 1 
              ? 'Join the MSSC 2026 initiative. Complete your professional registration to unlock career opportunities within the council.'
              : 'Step 2: Detailed application and documentation submission. Please ensure all details are accurate before final submission.'}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-12">
            {[1, 2, 3, 4].map((step, idx) => {
              const isActive = currentStep === step;
              const isPast = currentStep > step;

              return (
                <React.Fragment key={step}>
                  <div className={`flex items-center gap-3 ${!isActive && !isPast ? 'opacity-60' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-white text-primary shadow-lg' : isPast ? 'bg-white text-primary border-2 border-white' : 'border-2 border-white/50 text-white'}`}>
                      {isPast ? <span className="material-symbols-outlined text-sm">check</span> : step}
                    </div>
                    <span className={`font-label-md text-[14px] ${isActive ? 'font-bold text-white' : 'font-medium text-white'}`}>
                      {stepNames[step - 1]}
                    </span>
                  </div>
                  {idx < 3 && <div className="hidden md:block w-16 h-px bg-white/30"></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. Main Form Island */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-32 pb-24 relative z-20">
        <div className="bg-white shadow-island rounded-[16px] p-8 md:p-12 transition-transform duration-300 hover:shadow-xl">
          <form className={currentStep === 1 ? "space-y-12" : ""} onSubmit={handleSubmit}>
            
            {/* ======================================================== */}
            {/* STEP 1: INITIAL REGISTRATION CONTENT                     */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Left Column */}
                  <div className="space-y-8">
                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Post Name</label>
                      <div className="py-2.5 p-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface">
                        Multi Tasking Staff (MTS)
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Are you citizen of india?</p>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="citizen"
                              value={opt}
                              checked={formData.citizen === opt}
                              onChange={handleInputChange}
                              required
                              className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            />
                            <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Can you speak Manipuri or any tribal dialect of Manipur?</p>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="dialect"
                              value={opt}
                              checked={formData.dialect === opt}
                              onChange={handleInputChange}
                              required
                              className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            />
                            <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">The candidate must be a permanent resident of Manipur.</p>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="residencyConfirmed"
                          checked={formData.residencyConfirmed}
                          onChange={handleCheckboxChange}
                          required
                          className="w-5 h-5 text-primary border-outline rounded focus:ring-primary"
                        />
                        <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">I confirm residency eligibility</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Gender</label>
                        <div className="relative">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                            className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                          >
                            <option value="">Please Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                        </div>
                      </div>
                      <div>
                        <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Marital Status</label>
                        <div className="relative">
                          <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            required
                            className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                          >
                            <option value="">Please Select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Reservation Category</label>
                      <div className="relative">
                        <select
                          name="reservationCategory"
                          value={formData.reservationCategory}
                          onChange={handleInputChange}
                          required
                          className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        >
                          <option value="">Please Select</option>
                          <option value="gen">General</option>
                          <option value="obc">OBC</option>
                          <option value="sc">SC</option>
                          <option value="st">ST</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Physically Handicapped (PH)</p>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map((opt) => (
                          <label key={`ph-${opt}`} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="ph"
                              value={opt}
                              checked={formData.ph === opt}
                              onChange={handleInputChange}
                              required
                              className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            />
                            <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                      {formData.ph === 'Yes' && (
                        <p className="text-error font-label-sm text-[12px] italic">[Must have a minimum of 40% specified disability]</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Name of Candidate</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Date of Birth</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Day', field: 'dobDay' as const, options: days },
                          { label: 'Month', field: 'dobMonth' as const, options: months },
                          { label: 'Year', field: 'dobYear' as const, options: years },
                        ].map((item) => (
                          <div key={item.field} className="relative">
                            <select
                              name={item.field}
                              value={formData[item.field]}
                              onChange={handleInputChange}
                              required
                              className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none text-on-surface-variant"
                            >
                              <option value="">{item.label}</option>
                              {item.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xs">expand_more</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Mobile No.</label>
                      {errors.mobile && (
                        <p className="text-error font-label-sm text-[12px] mb-2">{errors.mobile}</p>
                      )}
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        required
                        className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        placeholder="Enter your mobile number"
                      />
                      <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Please keep this Mobile No. active for receiving communications]</p>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">E-mail Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        placeholder="Enter your email address"
                      />
                      <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Note: Please keep this Email ID active for the Recruitment process]</p>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Select District</label>
                      <div className="relative">
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                          className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        >
                          <option value="">Please Select</option>
                          <option value="imphal_east">Imphal East</option>
                          <option value="imphal_west">Imphal West</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                      </div>
                      <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Note: Select your district of residence]</p>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Captcha</label>
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="bg-surface-container rounded-lg py-2.5 px-3 border border-outline-variant flex items-center gap-2 w-full md:w-auto">
                          <div className="px-3 py-1 bg-white flex items-center justify-center font-bold tracking-wide text-on-surface-variant select-none border border-outline-variant/30 italic font-serif whitespace-nowrap">
                            {captcha}
                          </div>
                          <button type="button" className="material-symbols-outlined shrink-0 text-primary hover:rotate-180 transition-all duration-300 text-xl leading-none">refresh</button>
                        </div>
                        <div className="relative w-full">
                          <input
                            type="text"
                            name="captchaInput"
                            value={formData.captchaInput}
                            onChange={handleInputChange}
                            required
                            className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                            placeholder="Enter security code"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Are you State Government Employees?</p>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map((opt) => (
                          <label key={`gov-${opt}`} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="govEmployee"
                              value={opt}
                              checked={formData.govEmployee === opt}
                              onChange={handleInputChange}
                              required
                              className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            />
                            <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-2 border-t border-outline-variant/30">
                  <button
                    type="submit"
                    className="primary-gradient text-white px-12 py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                  >
                    Proceed to Application
                  </button>
                  <p className="mt-6 text-on-surface-variant font-label-sm text-[12px] font-medium">
                    Already registered? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
                  </p>
                </div>
              </>
            )}


            {/* ======================================================== */}
            {/* STEP 2: DETAILED APPLICATION CONTENT                     */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
                
                {/* 1. Personal Details Section */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">person</span>
                        Personal Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block font-label-md text-[14px] text-on-surface-variant">Name of Candidate</label>
                                <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" placeholder="" />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="block font-label-md text-[14px] text-on-surface-variant">Date of Birth</label>
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  { label: 'Day', field: 'dobDay' as const, options: days },
                                  { label: 'Month', field: 'dobMonth' as const, options: months },
                                  { label: 'Year', field: 'dobYear' as const, options: years },
                                ].map((item) => (
                                  <div key={item.field} className="relative">
                                    <select
                                      name={item.field}
                                      value={formData[item.field]}
                                      onChange={handleInputChange}
                                      required
                                      className="w-full p-3 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md outline-none text-on-surface-variant"
                                    >
                                      <option value="">{item.label}</option>
                                      {item.options.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xs">expand_more</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block font-label-md text-[14px] text-on-surface-variant">Gender</label>
                                <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-[14px] text-on-surface-variant">District</label>
                                <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none">
                                    <option value="">Select District</option>
                                    <option value="imphal_east">Imphal East</option>
                                    <option value="imphal_west">Imphal West</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-[14px] text-on-surface-variant">Mobile No.</label>
                                <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="tel" placeholder="" />
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-[14px] text-on-surface-variant">Marital Status</label>
                                <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none">
                                    <option value="">Select Status</option>
                                    <option value="unmarried">Unmarried</option>
                                    <option value="married">Married</option>
                                </select>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="block font-label-md text-[14px] text-on-surface-variant">E-mail Address</label>
                                <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="email" placeholder="" />
                            </div>
                        </div>

                        <div className="bg-surface-container-low rounded-xl p-6 flex flex-col items-center justify-between gap-6 border border-outline-variant/30">
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="w-24 h-24 bg-surface-container rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden">
                                    <span className="material-symbols-outlined text-outline text-4xl">no_photography</span>
                                </div>
                                <div className="w-full">
                                    <label className="block font-label-sm text-[12px] text-on-surface-variant mb-1 text-center">Photo Upload</label>
                                    <input type="file" className="text-xs w-full" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="w-24 h-12 bg-surface-container rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden">
                                    <span className="material-symbols-outlined text-outline text-2xl">draw</span>
                                </div>
                                <div className="w-full">
                                    <label className="block font-label-sm text-[12px] text-on-surface-variant mb-1 text-center">Signature Upload</label>
                                    <input type="file" className="text-xs w-full" />
                                </div>
                            </div>
                            <p className="text-[10px] text-on-surface-variant/70 text-center leading-tight">Only jpeg, jpg allowed. File size 20kb - 50kb.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="space-y-1">
                            <label className="block font-label-md text-[14px] text-on-surface-variant">Father's Name</label>
                            <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" />
                        </div>
                        <div className="space-y-1">
                            <label className="block font-label-md text-[14px] text-on-surface-variant">Mother's Name</label>
                            <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="block font-label-md text-[14px] text-on-surface-variant">Identification Marks</label>
                            <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" placeholder="e.g. A mole on the left cheek" />
                        </div>
                        <div className="space-y-1">
                            <label className="block font-label-md text-[14px] text-on-surface-variant">Permanent Address</label>
                            <textarea className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[100px] outline-none"></textarea>
                        </div>
                        <div className="space-y-1">
                            <label className="flex items-center justify-between font-label-md text-[14px] text-on-surface-variant">
                                Correspondence Address
                                <span className="text-[11px] flex items-center gap-1 font-normal"><input type="checkbox" className="rounded text-primary focus:ring-primary w-3 h-3" /> Same as Permanent</span>
                            </label>
                            <textarea className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[100px] outline-none"></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div className="space-y-2">
                            <p className="font-label-md text-[14px] text-on-surface-variant">Are you State Gov. Employee?</p>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gov_emp" className="text-primary" /> <span className="text-body-md">Yes</span></label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gov_emp" className="text-primary" /> <span className="text-body-md">No</span></label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="font-label-md text-[14px] text-on-surface-variant">Sponsored by Employment Exch.?</p>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sponsored" className="text-primary" /> <span className="text-body-md">Yes</span></label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sponsored" className="text-primary" /> <span className="text-body-md">No</span></label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="font-label-md text-[14px] text-on-surface-variant">Nationality</p>
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-label-sm">Indian</span>
                        </div>
                    </div>
                </section>

                {/* 2. Additional Documents */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">description</span>
                        Additional Documents &amp; Eligibility
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-2">
                            <label className="block font-label-md text-[14px] text-on-surface-variant">Certificate of eligibility [PAN, Aadhaar, etc]</label>
                            <input type="file" className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-[14px] text-on-surface-variant">Permanent Resident Certificate</label>
                            <input type="file" className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-[14px] text-on-surface-variant">Domicile Certificate</label>
                            <input type="file" className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block font-label-md text-[14px] text-on-surface-variant">Reservation Category</label>
                                <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none">
                                    <option value="">Select Category</option>
                                    <option value="ur">UR (General)</option>
                                    <option value="obc">OBC</option>
                                    <option value="sc">SC</option>
                                    <option value="st">ST</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-[14px] text-on-surface-variant">PH Status</label>
                                <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Educational Details */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">school</span>
                        Educational Details
                    </h2>
                    <div className="overflow-x-auto border border-outline-variant rounded-lg">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-surface-container-low border-b border-outline-variant">
                                <tr>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-12 text-center">Sr.No</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">Name of Examination</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">School/College/Institution</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">Board/University</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-24">Year</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-24">% Marks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30">
                                <tr className="hover:bg-surface-bright transition-colors">
                                    <td className="p-3 text-center text-[16px] font-medium text-on-surface-variant">A</td>
                                    <td className="p-3 text-[16px] font-medium">10th / Equivalent</td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" placeholder="99.99" /></td>
                                </tr>
                                <tr className="hover:bg-surface-bright transition-colors">
                                    <td className="p-3 text-center text-[16px] font-medium text-on-surface-variant">B</td>
                                    <td className="p-3 text-[16px] font-medium">Intermediate / Equi.</td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                </tr>
                                <tr className="hover:bg-surface-bright transition-colors">
                                    <td className="p-3 text-center text-[16px] font-medium text-on-surface-variant">C</td>
                                    <td className="p-3 text-[16px] font-medium">Graduation</td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                </tr>
                                <tr className="hover:bg-surface-bright transition-colors">
                                    <td className="p-3 text-center text-[16px] font-medium text-on-surface-variant">D</td>
                                    <td className="p-3 text-[16px] font-medium">Post Graduation</td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 4. Mandatory Uploads */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block font-label-md text-[14px] text-on-surface-variant">Marksheet of H.S.L.C./ Matriculate</label>
                        <input type="file" className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-[14px] text-on-surface-variant">Provisional Certificate of H.S.L.C./ Matriculate</label>
                        <input type="file" className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none" />
                    </div>
                </section>

                {/* 5. Work Experience Details */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined">work</span>
                            Work Experience Details
                        </h2>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="has_exp" value="yes" className="text-primary focus:ring-primary" />
                                <span className="font-label-md text-[14px] text-on-surface group-hover:text-primary transition-colors">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input defaultChecked type="radio" name="has_exp" value="no" className="text-primary focus:ring-primary" />
                                <span className="font-label-md text-[14px] text-on-surface group-hover:text-primary transition-colors">No</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* UPDATED: Dynamic Work Experience Rows mapped from state */}
                    {workExperienceRows.map((row, index) => (
                      <div key={index} className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-end ${index > 0 ? 'mt-6 pt-6 border-t border-outline-variant/50' : ''}`}>
                          <div className="space-y-1">
                              <label className="block font-label-sm text-[12px] text-on-surface-variant">Employer/Designation</label>
                              <input className="w-full p-2 border border-outline-variant rounded bg-white text-sm outline-none" placeholder="Employer/Designation" type="text" />
                          </div>
                          <div className="space-y-1">
                              <label className="block font-label-sm text-[12px] text-on-surface-variant">Service Period (Months)</label>
                              <input className="w-full p-2 border border-outline-variant rounded bg-white text-sm outline-none" placeholder="Total Months" type="number" />
                          </div>
                          <div className="space-y-1">
                              <label className="block font-label-sm text-[12px] text-on-surface-variant">Upload Certificate</label>
                              <input type="file" className="w-full p-1.5 border border-outline-variant rounded bg-white text-xs outline-none" />
                          </div>
                          <div className="space-y-1">
                              <label className="block font-label-sm text-[12px] text-on-surface-variant">Reason of Leaving</label>
                              <input className="w-full p-2 border border-outline-variant rounded bg-white text-sm outline-none" placeholder="Remark" type="text" />
                          </div>
                      </div>
                    ))}
                    
                    <button 
                        type="button" 
                        onClick={() => setWorkExperienceRows([...workExperienceRows, workExperienceRows.length + 1])}
                        className="mt-6 px-4 py-2 border border-primary text-primary rounded-lg font-label-sm text-[12px] flex items-center gap-2 hover:bg-primary/5 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add More
                    </button>
                </section>

                {/* 6. Final Actions */}
                <div className="flex flex-col items-center justify-center pt-12 border-t border-outline-variant/30 space-y-8">
                    
                    {/* UPDATED: Fixed Captcha Layout */}
                    <div className="w-full max-w-lg space-y-4">
                        <label className="block font-label-md text-[14px] text-on-surface-variant text-center">Security Verification</label>
                        <div className="flex flex-row justify-center gap-4 items-center">
                            <div className="bg-surface-container rounded-lg p-2 border border-outline-variant flex items-center justify-center shrink-0 overflow-hidden">
                                <div className="h-12 w-32 bg-white flex items-center justify-center font-bold tracking-widest text-on-surface-variant select-none border border-outline-variant/30 italic" style={{ fontFamily: 'serif' }}>
                                    U D J I L 2
                                </div>
                                <button className="material-symbols-outlined ml-2 text-primary hover:rotate-180 transition-all duration-300" type="button">refresh</button>
                            </div>
                            <input className="w-full max-w-[200px] p-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md outline-none" placeholder="Enter security code" type="text" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full">
                        <div className="flex items-center gap-4">
                            <button 
                                type="button" 
                                onClick={() => {
                                  setCurrentStep(1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-8 py-4 border-2 border-outline-variant text-on-surface-variant rounded-full font-label-md text-[14px] font-bold hover:bg-surface-container-low transition-all active:scale-95"
                            >
                                Back
                            </button>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="primary-gradient text-white px-16 py-4 rounded-full font-label-md text-[14px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                        <p className="text-on-surface-variant font-label-sm text-[12px] text-center">
                            By submitting, you agree to the <a className="text-primary font-bold hover:underline" href="#">Terms and Conditions</a> of MSSC 2026.
                        </p>
                    </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}