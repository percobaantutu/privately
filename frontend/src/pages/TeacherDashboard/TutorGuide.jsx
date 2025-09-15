import React from "react";
import { Zap, UserCheck, CalendarDays, CheckCircle, Banknote } from "lucide-react";

const GuideSection = ({ icon, title, children }) => (
  <div className="mb-8">
    <div className="flex items-center mb-2">
      <div className="bg-primary/10 text-primary p-2 rounded-lg mr-4">{icon}</div>
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="pl-14 text-gray-600 space-y-3">{children}</div>
  </div>
);

const TutorGuide = () => {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Privately!</h1>
        <p className="text-lg text-gray-500 mt-1">A Guide to Your Success on Our Platform</p>
      </div>

      <div className="max-w-4xl">
        <GuideSection icon={<Zap size={24} />} title="The 5 Steps to Getting Paid">
          <p>The entire process on Privately is designed to be simple and transparent. Here’s a quick overview of the journey:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Get Verified:</strong> You've already done this! We verify all tutors to maintain a high-quality, trusted community.
            </li>
            <li>
              <strong>Set Up Your Profile & Availability:</strong> Fill out your professional details, add your bank account for payouts, and set your weekly schedule.
            </li>
            <li>
              <strong>Get Booked by a Student:</strong> You will receive a notification when a student books one of your available time slots.
            </li>
            <li>
              <strong>Confirm the Session & Teach:</strong> You confirm the booking by providing a video meeting link (e.g., Zoom, Google Meet) and then conduct the session at the scheduled time.
            </li>
            <li>
              <strong>Get Paid:</strong> After you mark the session as "Complete," your earnings are added to your pending balance, which is then paid out to you according to our payout schedule.
            </li>
          </ol>
        </GuideSection>

        <GuideSection icon={<UserCheck size={24} />} title="Setting Up Your Profile & Schedule">
          <h3 className="text-lg font-semibold text-gray-700 mt-4">1. Your Profile is Your Storefront</h3>
          <p>A complete and professional profile attracts more students. Navigate to the "Profile" tab to update your bio, experience, and hourly rate.</p>
          <p className="font-semibold text-amber-700 bg-amber-50 p-3 rounded-md">
            <span className="font-bold">Action Required:</span> You must add your bank account details. We cannot pay you without this information. This data is stored securely and is only used for processing your payouts.
          </p>

          <h3 className="text-lg font-semibold text-gray-700 mt-4">2. Manage Your Schedule ("Availability" Tab)</h3>
          <p>You are in complete control of your schedule. Go to the "Availability" tab. You'll see a weekly calendar. Simply click on any time slot to mark it as "Available" (green). Click again to make it "Unavailable."</p>
          <p className="italic">
            <strong>Tip:</strong> Students can only book the green "Available" slots you set. Keep your schedule updated to maximize your booking potential.
          </p>
        </GuideSection>

        <GuideSection icon={<CalendarDays size={24} />} title="Managing Your Bookings">
          <p>
            When a student books a session, it will appear in your "Sessions" tab with a <span className="font-semibold text-orange-600">"Pending Confirmation"</span> status.
          </p>
          <p>To accept the booking, you must:</p>
          <ul className="list-disc list-inside">
            <li>Click on the session details.</li>
            <li>Provide a video meeting link (e.g., your personal Zoom or Google Meet link).</li>
            <li>Click "Confirm Session."</li>
          </ul>
          <p>The student will then be notified automatically.</p>
        </GuideSection>

        <GuideSection icon={<CheckCircle size={24} />} title="After the Session is Over">
          <p className="font-semibold text-red-700 bg-red-50 p-3 rounded-md">
            <span className="font-bold">This is a critical step!</span> After a session is complete, you must go to the "Sessions" tab and click the "Mark as Complete" button. This action is what moves the payment into your earnings
            balance.
          </p>
        </GuideSection>

        <GuideSection icon={<Banknote size={24} />} title="How You Earn: The Payout Flow">
          <h3 className="text-lg font-semibold text-gray-700 mt-4">1. The Payment Journey</h3>
          <p>When a student books, their payment is held securely by Privately. After you mark the session as complete, your share of the fee moves into your "Pending Balance," visible on your "Earnings" dashboard.</p>

          <h3 className="text-lg font-semibold text-gray-700 mt-4">2. Payout Schedule</h3>
          <p>
            Payouts are processed on the <strong>15th of every month</strong> for all earnings accumulated in the <em>previous</em> calendar month.
          </p>
          <p className="italic bg-gray-50 p-3 rounded-md border-l-4 border-gray-300">
            <strong>Example:</strong> All earnings you make between October 1st and October 31st will be paid out to your bank account on November 15th.
          </p>

          <h3 className="text-lg font-semibold text-gray-700 mt-4">3. Platform Fee</h3>
          <p>
            To operate the platform, handle payment processing, and provide support, Privately takes a small service fee. You receive <strong className="text-primary">85%</strong> of your listed hourly rate for every completed session. This
            is all clearly itemized on your "Earnings" dashboard.
          </p>
        </GuideSection>
      </div>
    </div>
  );
};

export default TutorGuide;
