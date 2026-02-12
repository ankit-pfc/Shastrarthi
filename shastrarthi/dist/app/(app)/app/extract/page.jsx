"use client";
import { useState, useEffect, useRef } from "react";
import { MultiSelect } from "@/components/ui/MultiSelect";
import Link from "next/link";
import { UploadCloud, X, FileText } from "lucide-react";
export default function ExtractPage() {
    const [question, setQuestion] = useState("");
    const [selectedTextIds, setSelectedTextIds] = useState([]);
    const [selectedDatasetId, setSelectedDatasetId] = useState(null);
    const [extractedRows, setExtractedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [availableTexts, setAvailableTexts] = useState([]);
    const [availableDatasets, setAvailableDatasets] = useState([]);
    const [newDatasetFile, setNewDatasetFile] = useState(null);
    const [newDatasetName, setNewDatasetName] = useState("");
    const fileInputRef = useRef(null);
    useEffect(() => {
        // Fetch available texts
        fetch("/api/texts?limit=50")
            .then((res) => res.json())
            .then((data) => setAvailableTexts(data.data || []))
            .catch((err) => console.error("Failed to fetch texts:", err));
        // Fetch available datasets
        fetch("/api/extract-datasets")
            .then((res) => res.json())
            .then((data) => setAvailableDatasets(data.data || []))
            .catch((err) => console.error("Failed to fetch datasets:", err));
    }, []);
    const handleFileUpload = async () => {
        if (!newDatasetFile || !newDatasetName) {
            alert("Please select a file and provide a name for the dataset.");
            return;
        }
        setIsLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                var _a;
                try {
                    const content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                    const parsedData = JSON.parse(content);
                    const response = await fetch("/api/extract-datasets", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: newDatasetName, data: parsedData }),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to upload dataset.");
                    }
                    const newDataset = await response.json();
                    setAvailableDatasets((prev) => [...prev, newDataset.data]);
                    setSelectedDatasetId(newDataset.data.id);
                    setNewDatasetFile(null);
                    setNewDatasetName("");
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
                catch (parseError) {
                    console.error("Error parsing file or uploading dataset:", parseError);
                    alert("Failed to process file. Ensure it's valid JSON.");
                }
                finally {
                    setIsLoading(false);
                }
            };
            reader.readAsText(newDatasetFile);
        }
        catch (error) {
            console.error("File upload error:", error);
            alert("Failed to upload file.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const runExtraction = async () => {
        if (!question.trim()) {
            alert("Please enter a question for extraction.");
            return;
        }
        if (selectedTextIds.length === 0 && !selectedDatasetId) {
            alert("Please select at least one text or one dataset for extraction.");
            return;
        }
        setIsLoading(true);
        setExtractedRows([]);
        try {
            const response = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "extract",
                    payload: {
                        question,
                        textIds: selectedTextIds,
                        datasetId: selectedDatasetId,
                    },
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to run extraction.");
            }
            const payload = await response.json();
            setExtractedRows(payload.data.content || []);
        }
        catch (error) {
            console.error("Extraction failed:", error);
            alert(error.message || "Failed to run extraction.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const textOptions = availableTexts.map((text) => ({
        label: text.title_en,
        value: text.id,
    }));
    return (<div className="space-y-4">
            <h1 className="text-h2 font-serif font-semibold text-gray-900">Extract Insights</h1>
            <p className="text-gray-600">Define custom extraction prompts across selected texts and datasets.</p>

            {/* Extraction Query Input */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <label htmlFor="question-input" className="block text-sm font-medium text-gray-700">Extraction Question</label>
                <input id="question-input" type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="E.g., How is detachment explained?" className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"/>
                
                <label className="block text-sm font-medium text-gray-700 mt-4">Select Sources</label>
                
                {/* Text Selection */}
                <div className="space-y-2">
                    <MultiSelect options={textOptions} selectedValues={selectedTextIds} onSelectChange={setSelectedTextIds} placeholder="Select Shastra texts..."/>
                </div>

                {/* Dataset Upload */}
                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                    <h3 className="text-md font-medium text-gray-800">Upload Custom Data (JSON array)</h3>
                    <div className="flex items-center space-x-2">
                        <input type="text" placeholder="Dataset Name (e.g., My Research Notes)" value={newDatasetName} onChange={(e) => setNewDatasetName(e.target.value)} className="flex-grow rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"/>
                        <label className="flex items-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
                            <UploadCloud className="w-5 h-5 mr-2 text-gray-600"/>
                            <span className="text-sm font-medium text-gray-700">{newDatasetFile ? newDatasetFile.name : "Choose JSON"}</span>
                            <input type="file" ref={fileInputRef} accept=".json" className="hidden" onChange={(e) => { var _a; return setNewDatasetFile(((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) || null); }}/>
                        </label>
                        {newDatasetFile && (<button onClick={() => {
                setNewDatasetFile(null);
                if (fileInputRef.current)
                    fileInputRef.current.value = "";
            }} className="p-2 rounded-full hover:bg-gray-100">
                                <X className="w-4 h-4 text-gray-500"/>
                            </button>)}
                        <button onClick={handleFileUpload} disabled={isLoading || !newDatasetFile || !newDatasetName.trim()} className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium">
                            Upload
                        </button>
                    </div>
                </div>

                {/* Existing Dataset Selection */}
                {availableDatasets.length > 0 && (<div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                        <h3 className="text-md font-medium text-gray-800">Or Select an Existing Dataset</h3>
                        <select value={selectedDatasetId || ""} onChange={(e) => setSelectedDatasetId(e.target.value || null)} className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">-- Select a Dataset --</option>
                            {availableDatasets.map((ds) => (<option key={ds.id} value={ds.id}>
                                    {ds.name} (Updated: {new Date(ds.updated_at).toLocaleDateString()})
                                </option>))}
                        </select>
                    </div>)}
                
                <button onClick={runExtraction} disabled={isLoading || (selectedTextIds.length === 0 && !selectedDatasetId)} className="w-full px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold mt-4">
                    {isLoading ? "Running Extraction..." : "Run Extraction"}
                </button>
            </div>

            {/* Extracted Insights Table */}
            {extractedRows.length > 0 && (<div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="text-left p-3">Text/Source</th>
                                <th className="text-left p-3">Extracted Insight</th>
                                <th className="text-left p-3">Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extractedRows.map((row, index) => (<tr key={`${row.ref}-${index}`} className="border-t border-gray-100">
                                    <td className="p-3">
                                        {row.textSlug ? (<Link href={`/app/reader/${row.textSlug}`} className="text-orange-600 hover:underline">
                                                <FileText className="inline-block w-4 h-4 mr-1"/> {row.text}
                                            </Link>) : (row.text)}
                                    </td>
                                    <td className="p-3">{row.insight}</td>
                                    <td className="p-3">{row.ref}</td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>)}
        </div>);
}
