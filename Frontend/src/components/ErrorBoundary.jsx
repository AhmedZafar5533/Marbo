// ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-red-700 mb-3">Something went wrong</h2>
                    <p className="mb-4 text-red-600">We're sorry, there was an error loading this form. Please try refreshing the page.</p>
                    <details className="bg-white p-3 rounded border border-red-100">
                        <summary className="cursor-pointer font-medium">Error details</summary>
                        <p className="mt-2 text-sm text-gray-700">{this.state.error && this.state.error.toString()}</p>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;