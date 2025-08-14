import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metrics, timestamp, userId } = body;

    // Log performance metrics (in production, you'd send this to a monitoring service)
    console.log('Performance Metrics:', {
      userId,
      timestamp,
      metrics: {
        FCP: metrics.FCP, // First Contentful Paint
        LCP: metrics.LCP, // Largest Contentful Paint
        FID: metrics.FID, // First Input Delay
        CLS: metrics.CLS, // Cumulative Layout Shift
        TTFB: metrics.TTFB, // Time to First Byte
        navigation: metrics.navigation,
        memory: metrics.memory,
      }
    });

    // Store metrics in database or analytics service
    // This is where you'd integrate with services like:
    // - Google Analytics 4
    // - Sentry
    // - LogRocket
    // - Custom analytics database

    return NextResponse.json({ 
      success: true, 
      message: 'Performance metrics recorded',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error recording performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to record performance metrics' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Performance monitoring endpoint',
    endpoints: {
      POST: 'Send performance metrics',
      GET: 'Get endpoint information'
    },
    metrics: [
      'FCP - First Contentful Paint',
      'LCP - Largest Contentful Paint', 
      'FID - First Input Delay',
      'CLS - Cumulative Layout Shift',
      'TTFB - Time to First Byte',
      'Navigation Timing',
      'Memory Usage'
    ]
  });
} 