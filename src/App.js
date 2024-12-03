import React from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import worker from 'pdfjs-dist/build/pdf.worker.entry';

const useStyles = makeStyles({
  pdfContainer: {
    height: '500px', // Adjust as needed
    width: '600px',  // Adjust as needed
    position: 'relative',
    overflow: 'hidden',
  },
  viewer: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 255, 0.3)',
    border: '2px solid blue',
    pointerEvents: 'none',
    zIndex: 10,
  },
});

function App() {
  const classes = useStyles();

  const fileUrl = '/sample.pdf';
  const initialPage = 2;

  const boundingBoxes = [
    {
      pageNumber: 2,
      left: 80,
      top: 500,
      width: 600,
      height: 50,
    },
  ];

  const renderPage = (props) => {
    const {
      pageIndex,
      scale,
      canvasLayer,
      textLayer,
      annotationLayer,
      height,
      width,
    } = props;

    console.log('renderPage called with props:', props);

    if (!height || !width) {
      console.error('Height or width is undefined');
      return null;
    }

    const pageHeight = height;
    const pageWidth = width;

    console.log('Page dimensions:', { pageWidth, pageHeight });

    const currentBoundingBoxes = boundingBoxes.filter(
      (box) => box.pageNumber - 1 === pageIndex
    );

    console.log('Current bounding boxes:', currentBoundingBoxes);

    const highlights = currentBoundingBoxes.map((box, idx) => {
      console.log('Original box coordinates:', box);

      // Adjusting calculations
      const scaledLeft = box.left * scale;
      const scaledTop = pageHeight - (box.top + box.height) * scale;
      const scaledWidth = box.width * scale;
      const scaledHeight = box.height * scale;

      console.log(`Rectangle ${idx} coordinates:`, {
        left: scaledLeft,
        top: scaledTop,
        width: scaledWidth,
        height: scaledHeight,
      });

      return (
        <div
          key={idx}
          className={classes.highlight}
          style={{
            left: scaledLeft,
            top: scaledTop,
            width: scaledWidth,
            height: scaledHeight,
            position: 'absolute',
          }}
        />
      );
    });

    return (
      <div style={{ position: 'relative' }}>
        {canvasLayer.children}
        {textLayer.children}
        {annotationLayer.children}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${pageWidth * scale}px`,
            height: `${pageHeight * scale}px`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {highlights}
        </div>
      </div>
    );
  };

  return (
    <Card className={classes.pdfContainer}>
      <Worker workerUrl={worker}>
        <div className={classes.viewer}>
          <Viewer
            fileUrl={fileUrl}
            initialPage={initialPage - 1}
            renderPage={renderPage}
            defaultScale={SpecialZoomLevel.PageFit}
          />
        </div>
      </Worker>
    </Card>
  );
}

export default App;