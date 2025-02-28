"use client";
import Layout from '../components/layout'; 
export default function Resources() {
  return (
    <Layout>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resources</h1>
      <p className="text-gray-700">
        This is the Resources page. You can find useful resources and materials here.
      </p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Available Resources</h2>
        <ul className="list-disc list-inside mt-2">
          <li>Resource 1: Strategic Defense Handbook</li>
          <li>Resource 2: Operation Planning Templates</li>
          <li>Resource 3: Report Generation Guidelines</li>
        </ul>
      </div>
    </div>
    </Layout>
  );
}