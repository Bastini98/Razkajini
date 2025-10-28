import React from "react";

type Props = { children: React.ReactNode };

type State = {
  hasError: boolean;
  error?: any;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("UI crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 text-red-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white border border-red-200 rounded-2xl p-6 shadow">
            <h1 className="text-xl font-bold mb-2">Страницата се счупи</h1>
            <p className="mb-4">
              Показваме грешката, за да можем да я оправим бързо.
            </p>
            <pre className="text-xs whitespace-pre-wrap bg-red-50 p-3 rounded border border-red-200 overflow-auto">
{String(this.state.error ?? "Unknown error")}
            </pre>
            <p className="mt-4 text-sm text-gray-600">
              Виж и Console (F12 → Console) за повече детайли.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
 