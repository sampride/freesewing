import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.props.gist !== prevProps.gist) {
      this.setState({hasError: false})
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.errorView  || (<h1>Something went wrong.</h1>);
    }

    try {
      return this.props.children;
    } catch(e) {
      return this.props.errorView  || (<h1>Something went wrong.</h1>);
    }
  }
}

export default ErrorBoundary
