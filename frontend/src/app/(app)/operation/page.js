import Layout from '../components/layout'; 

export default function Operation() {
  return (
    <Layout> 
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Operation</h1>
        <p className="text-gray-700">
          This is the Operation page. You can manage and track ongoing operations here.
        </p>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Ongoing Operations</h2>
          <ul className="list-disc list-inside mt-2">
            <li>Operation Alpha</li>
            <li>Operation Bravo</li>
            <li>Operation Charlie</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}