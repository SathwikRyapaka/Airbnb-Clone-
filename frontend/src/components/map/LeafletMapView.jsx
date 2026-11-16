import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const LeafletMapView = ({
  listings = [],
  singleListing = null,
  height = '500px',
  zoom = 13,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Determine initial center
    let defaultCenter = [48.8566, 2.3522]; // Paris default
    let defaultZoom = zoom;

    if (singleListing && singleListing.location?.coordinates) {
      defaultCenter = [
        singleListing.location.coordinates.lat,
        singleListing.location.coordinates.lng,
      ];
      defaultZoom = 14;
    } else if (listings.length > 0 && listings[0].location?.coordinates) {
      defaultCenter = [
        listings[0].location.coordinates.lat,
        listings[0].location.coordinates.lng,
      ];
    }

    // Clean up existing map instance if present
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      scrollWheelZoom: false,
    });
    mapInstanceRef.current = map;

    // Tile Layer: OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // If single listing view
    if (singleListing && singleListing.location?.coordinates) {
      const { lat, lng } = singleListing.location.coordinates;
      const customPin = L.divIcon({
        className: 'airbnb-custom-pin',
        html: `
          <div style="background: linear-gradient(135deg, #8DB9F0, #F5B69E); color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(141, 185, 240, 0.4); border: 3px solid white;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      L.marker([lat, lng], { icon: customPin })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; font-size: 13px; font-weight: 600; padding: 6px;">
            <p style="margin: 0; color: #1e293b;">${singleListing.title}</p>
            <p style="margin: 4px 0 0; color: #64748b; font-size: 11px;">${singleListing.location?.city}, ${singleListing.location?.country}</p>
          </div>
        `);
      return;
    }

    // Multiple listings view
    if (listings && listings.length > 0) {
      const markers = [];

      listings.forEach((item) => {
        if (!item.location?.coordinates?.lat || !item.location?.coordinates?.lng) return;

        const { lat, lng } = item.location.coordinates;

        // Custom Powder Blue & Sunset Peach price bubble
        const priceIcon = L.divIcon({
          className: 'custom-bubble',
          html: `
            <div style="background-color: white; color: #1e293b; font-weight: 800; font-size: 12px; padding: 5px 12px; border-radius: 20px; box-shadow: 0 4px 14px rgba(141, 185, 240, 0.35); border: 2px solid #8DB9F0; white-space: nowrap; cursor: pointer; transition: all 0.2s ease;">
              $${item.pricePerNight}
            </div>
          `,
          iconSize: [64, 28],
          iconAnchor: [32, 14],
        });

        const popupHtml = `
          <div style="width: 230px; font-family: inherit; padding: 2px;">
            <img src="${item.images?.[0]?.url || ''}" style="width: 100%; height: 135px; object-fit: cover; border-radius: 14px; margin-bottom: 8px;" alt="${item.title}" />
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-weight: 800; font-size: 13px; color: #0f172a;">${item.location?.city || ''}</span>
              <span style="font-size: 11px; font-weight: 700; color: #E28664;">★ ${item.rating > 0 ? item.rating.toFixed(2) : 'New'}</span>
            </div>
            <p style="font-size: 11px; color: #64748b; margin: 3px 0 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.title}</p>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a;">$${item.pricePerNight} <span style="font-size: 11px; font-weight: 500; color: #64748b;">night</span></div>
            <a href="/listing/${item._id}" style="display: block; margin-top: 10px; padding: 8px 14px; background: linear-gradient(135deg, #8DB9F0, #F5B69E); color: white; border-radius: 12px; text-align: center; text-decoration: none; font-size: 11px; font-weight: 800; box-shadow: 0 4px 10px rgba(141, 185, 240, 0.3);">View Listing</a>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: priceIcon })
          .addTo(map)
          .bindPopup(popupHtml, { maxWidth: 270 });

        markers.push([lat, lng]);
      });

      // Fit map bounds to encompass all pins
      if (markers.length > 0) {
        try {
          const bounds = L.latLngBounds(markers);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        } catch (e) {
          // ignore
        }
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings, singleListing, zoom]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-3xl overflow-hidden shadow-card border border-lavender z-10"
    />
  );
};

export default LeafletMapView;
