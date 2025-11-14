import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs/history")
      .then((res) => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("new-import-log", (log) => {
      // console.log("New log received:", log);
      setLogs((prev) => [log, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl font-semibold text-gray-600">
        Loading Import Logs...
      </div>
    );
  }

  const runImport = async () => {
    try {
      setImportLoading(true);

      await axios.get("http://localhost:5000/api/jobs/import");
    } catch (err) {
      console.error(err);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Job Import History (Live)
        </h1>

        <button
          onClick={runImport}
          disabled={importLoading}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition flex items-center gap-2 ${
            importLoading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {importLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Run Import Now"
          )}
        </button>

        <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">File Name</th>
                <th className="p-3 border">ImportDateTime</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">New</th>
                <th className="p-3 border">Updated</th>
                <th className="p-3 border">Failed</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 text-lg"
                  >
                    No Import Logs Found
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={log._id || index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 border text-center font-semibold">
                      {index + 1}
                    </td>

                    <td className="p-3 border">{log.fileName}</td>
                    <td className="p-3 border text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="p-3 border text-blue-700 font-semibold">
                      {log.totalFetched}
                    </td>

                    <td className="p-3 border text-green-600 font-semibold">
                      {log.newJobs}
                    </td>

                    <td className="p-3 border text-yellow-600 font-semibold">
                      {log.updatedJobs}
                    </td>

                    <td className="p-3 border text-red-600 font-semibold">
                      {log.failedJobs}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
