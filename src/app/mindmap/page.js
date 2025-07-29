'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/utils/api';

const TEXTSIZE = 16;
const RADIUS = 60;
const MAXTEXTWIDTH = RADIUS * 1.6;
const GAP = 200;

export default function MindMapPage() {
    const router = useRouter();
    const canvasRef = useRef(null);
    const [mindMapData, setMindMapData] = useState(null);
    const [scale, setScale] = useState(1);
    const [userId, setUserId] = useState(null);
    const [gearButtons, setGearButtons] = useState([]);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [draggedBubble, setDraggedBubble] = useState(null);
    const [bubbleDragOffset, setBubbleDragOffset] = useState({ x: 0, y: 0 });
    const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, bubble: null });
    const dragStart = useRef({ x: 0, y: 0 });
    const dragOrigin = useRef({ x: 0, y: 0 });
    const draggedBubbleRef = useRef(null);

    useEffect(() => {
        console.log("calling useEffect 1");
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            router.push('/');
            return;
        }

        const user = JSON.parse(storedUser);
        console.log('User ID:', user?.id);

        if (!user?.id) {
            router.push('/');
            return;
        }

        setUserId(user.id);
        setMindMapData(user.personalMindMap);
        console.log('omg111 logged in as -', JSON.stringify(user.personalMindMap, null, 2));

    }, [userId]);

    function handleLogout() {
        localStorage.removeItem('user');
        router.push('/');
    }

    function truncateText(ctx, text, maxWidth) {
        let newText = text;
        while (ctx.measureText(newText).width > maxWidth && newText.length > 0) {
            newText = newText.slice(0, -1);
        }
        return newText + (text.length !== newText.length ? '..\n.' : '');
    }

    function wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    function renderBubble(ctx, bubble, level = 0, parentCoords = null, gearButtons = []) {
        const x = bubble.x, y = bubble.y;
        console.log('Rendering bubble:', bubble, 'at', x, y, 'curBubble:', bubble.x, bubble.y);

        // Draw line with arrow from parent to this bubble (edge to edge)
        if (parentCoords) {
            // Calculate direction vector from parent to this bubble
            const dx = x - parentCoords.x;
            const dy = y - parentCoords.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Start point: edge of parent bubble
            const startX = parentCoords.x + (dx / dist) * RADIUS;
            const startY = parentCoords.y + (dy / dist) * RADIUS;
            // End point: edge of this bubble
            const endX = x - (dx / dist) * RADIUS;
            const endY = y - (dy / dist) * RADIUS;

            // Draw the line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Draw arrowhead at the end (pointing to child)
            const arrowLength = 18;
            const angle = Math.atan2(dy, dx);

            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
            endX - arrowLength * Math.cos(angle - Math.PI / 8),
            endY - arrowLength * Math.sin(angle - Math.PI / 8)
            );
            ctx.moveTo(endX, endY);
            ctx.lineTo(
            endX - arrowLength * Math.cos(angle + Math.PI / 8),
            endY - arrowLength * Math.sin(angle + Math.PI / 8)
            );
            ctx.stroke();
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = '#f5f6fa';
        ctx.fill();
        ctx.strokeStyle = '#273c75';
        ctx.stroke();

        // Draw text
        ctx.fillStyle = '#273c75';
        ctx.textAlign = 'center';
        ctx.font = `${TEXTSIZE}px sans-serif`;

        /*//truncate text
        ctx.fillText(truncateText(ctx, bubble.title, MAXTEXTWIDTH), x, y + (TEXTSIZE / 3.0));*/

        /*//fit text inside the circle
        ctx.fillText(bubble.title, x, y + (TEXTSIZE / 3.0), MAXTEXTWIDTH);*/

        //fit text inside the circle with word wrap
        const lines = wrapText(ctx, bubble.title, MAXTEXTWIDTH);
        let tooLong = false
        if (lines.length > 4) {
            //set lines to only have the first 4 lines
            tooLong = true;
            lines.length = 4;
        }
        lines.forEach((line, i) => {
            console.log(i,lines.length);
            console.log(y + (i - (lines.length - 1) / 2) * TEXTSIZE + (TEXTSIZE / 3.0));
            ctx.fillText(line, x, y + (i - (lines.length - 1) / 2) * TEXTSIZE + (TEXTSIZE / 3.0));
        });
        if (tooLong) {
            ctx.fillText('...', x, y + (8.5/3) * TEXTSIZE);
        }

        // Draw "⚙️" button
        const gearX = x + RADIUS * 0.61;
        const gearY = y - RADIUS * 0.61;
        ctx.font = '14px sans-serif';
        ctx.fillText('⚙️', gearX, gearY + 5);

        // Track Buttons
        gearButtons.push({ x: gearX, y: gearY, r: TEXTSIZE / 2, bubble });

        // Draw sub-bubbles
        bubble.childBubbles.forEach((child) => {
            renderBubble(ctx, child, level + 1, { x, y }, gearButtons);
        });
    }

    function createBubble() {
        const currentBubble = popup.bubble;
        console.log(`Clicked +2 on bubble titled: "${currentBubble.title}" with parentId: ${currentBubble.id}`);
        // TODO: Open a prompt to create a new bubble, and call your backend
        const newBubbleTitle = prompt('Enter title for new bubble:');
        if (newBubbleTitle) {

            // Calculate position for the new bubble so it doesn't overlap with the parent or its children

            // Collect angles of existing children relative to parent
            const usedAngles = currentBubble.childBubbles.filter(child => {
                const dx = child.x - currentBubble.x;
                const dy = child.y - currentBubble.y;
                return Math.sqrt(dx * dx + dy * dy) <= GAP + (RADIUS * 2);
            }).map(child => {
                return Math.atan2(child.y - currentBubble.y, child.x - currentBubble.x);
            });

            // Try to find a free angle (in 45-degree increments)
            let found = false;
            let angle = 0;
            for (let i = 0; i < 8; i++) {
                angle = (i * Math.PI / 4); // 0, 45, 90, ... 315 deg
                // Check if this angle is not too close to any used angle
                if (!usedAngles.some(a => Math.abs(a - angle) < Math.PI / 6)) {
                    found = true;
                    break;
                }
            }
            if (!found && usedAngles.length > 0) {
                // If all directions are taken, pick the one with the largest gap
                usedAngles.sort((a, b) => a - b);
                let maxGap = 0;
                let bestAngle = 0;
                for (let i = 0; i < usedAngles.length; i++) {
                    let next = usedAngles[(i + 1) % usedAngles.length];
                    let gap = ((next - usedAngles[i] + 2 * Math.PI) % (2 * Math.PI));
                    if (gap > maxGap) {
                        maxGap = gap;
                        bestAngle = (usedAngles[i] + gap / 2) % (2 * Math.PI);
                    }
                }
                angle = bestAngle;
            }

            // Calculate new bubble position
            const newX = currentBubble.x + Math.cos(angle) * GAP;
            const newY = currentBubble.y + Math.sin(angle) * GAP;

            fetch(`${apiUrl}/createBubble`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newBubbleTitle,
                    x: newX,
                    y: newY,
                    parentId: currentBubble.id,
                    userId: userId
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log('New bubble created:', data);
                const updatedMindMapData = { ...mindMapData };
                console.log('Updated mind map data0:', JSON.stringify(data.bubble, null, 2));
                console.log('Updated mind map data2:', JSON.stringify(mindMapData, null, 2));
                currentBubble.childBubbles.push(data.bubble);
                console.log('Updated mind map data3:', JSON.stringify(updatedMindMapData, null, 2));

                //update user.personalMindMap in localStorage to be mindMapData
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.personalMindMap = updatedMindMapData;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                setMindMapData(updatedMindMapData);
            })
            .catch(err => {
                console.log('Error creating bubble:', err);
                alert('Failed to create bubble. Please try again.');
            });
        }
        return;

    }

    function deleteBubble() {
        const currentBubble = popup.bubble;
        console.log(`Clicked +2 on bubble titled: "${currentBubble.title}" with parentId: ${currentBubble.id}`);
        // TODO: Open a prompt to create a new bubble, and call your backend
        const deleteBubble = prompt(`Are you sure you want to delete this bubble and all of it's sub-categories (this process cannot be undon2)? If so type 'yes'`);
        if (deleteBubble === 'yes') {
            fetch(`${apiUrl}/deleteBubble`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bubble: currentBubble
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log('Bubble deleted:', data);
                const updatedMindMapData = { ...mindMapData };
                // Remove the bubble from the mind map data
                const removeBubble = (bubble) => {
                    if (bubble.id === currentBubble.id) {
                        return null; // Remove this bubble
                    }
                    bubble.childBubbles = bubble.childBubbles.map(removeBubble).filter(b => b !== null);
                    return bubble;
                };
                updatedMindMapData.childBubbles = updatedMindMapData.childBubbles.map(removeBubble).filter(b => b !== null);
                
                //update user.personalMindMap in localStorage to be mindMapData
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.personalMindMap = updatedMindMapData;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                setMindMapData(updatedMindMapData);
            })
            .catch(err => {
                console.log('Error deleting bubble:', err);
                alert('Failed to delete bubble. Please try again.');
            });
        }
        return;

    }

    function editBubble() {
        const currentBubble = popup.bubble;
        console.log(`Clicked +2 on bubble titled: "${currentBubble.title}" with parentId: ${currentBubble.id}`);
        // TODO: Open a prompt to create a new bubble, and call your backend
        const newTitle = prompt(`Enter new title:`);
        if (newTitle) {
            fetch(`${apiUrl}/editBubble`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentBubble.id,
                    title: newTitle
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log('Bubble edited:', data);
                const updatedMindMapData = { ...mindMapData };
                // Update the bubble title in the mind map data
                const updateBubble = (bubble) => {
                    if (bubble.id === currentBubble.id) {
                        bubble.title = newTitle;
                        return bubble;
                    }
                    bubble.childBubbles = bubble.childBubbles.map(updateBubble);
                    return bubble;
                };
                updatedMindMapData.childBubbles = updatedMindMapData.childBubbles.map(updateBubble);

                //update user.personalMindMap in localStorage to be mindMapData
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.personalMindMap = updatedMindMapData;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                setMindMapData(updatedMindMapData);
            })
            .catch(err => {
                console.log('Error editing bubble:', err);
                alert('Failed to edit bubble. Please try again.');
            });
        }
        return;

    }

    useEffect(() => {
        console.log("calling useEffect 2");
        function render() {
            if (!mindMapData || !canvasRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            ctx.setTransform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);
            ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            renderBubble(ctx, mindMapData);
        }

        // Initial render
        render();

        // Re-render on resize
        window.addEventListener('resize', render);
        return () => window.removeEventListener('resize', render);
    }, [mindMapData, scale]);

    useEffect(() => {
        console.log("calling useEffect 3");
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            // Adjust for offset!
            const x = (e.clientX - rect.left - canvas.width / 2 - offset.x) / scale;
            const y = (e.clientY - rect.top - canvas.height / 2 - offset.y) / scale;

            for (const gearButton of gearButtons) {
                const dx = x - gearButton.x;
                const dy = y - gearButton.y;
                if (Math.sqrt(dx * dx + dy * dy) < gearButton.r) {
                    setPopup({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        bubble: gearButton.bubble,
                        parentId: gearButton.bubble.parentId
                    });
                    return;
                }
            }
            setPopup({ visible: false, x: 0, y: 0, bubble: null });
        };

        canvas.addEventListener('click', handleClick);
        return () => canvas.removeEventListener('click', handleClick);
    }, [gearButtons, scale, offset]); // <-- add offset here!

    // Update render to use offset
    useEffect(() => {
        console.log("calling useEffect 4");
        if (!mindMapData || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.setTransform(
            scale, 0, 0, scale,
            canvas.width / 2 + offset.x,
            canvas.height / 2 + offset.y
        );
        ctx.clearRect(-canvas.width / 2 - offset.x, -canvas.height / 2 - offset.y, canvas.width, canvas.height);
        const gearButtons = [];
        renderBubble(ctx, mindMapData, 0, null, gearButtons);
        setGearButtons(gearButtons);
    }, [mindMapData, scale, offset]);

    useEffect(() => {
        console.log("calling useEffect 5");
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - canvas.width / 2 - offset.x) / scale;
            const y = (e.clientY - rect.top - canvas.height / 2 - offset.y) / scale;

            // Iterative search for bubble under mouse
            let foundBubble = null;
            const stack = mindMapData ? [mindMapData] : [];
            while (stack.length > 0) {
                const bubble = stack.pop();
                const dx = x - bubble.x;
                const dy = y - bubble.y;
                if (Math.sqrt(dx * dx + dy * dy) < RADIUS) {
                    foundBubble = bubble;
                    break;
                }
                // Add children to stack
                for (let i = bubble.childBubbles.length - 1; i >= 0; i--) {
                    stack.push(bubble.childBubbles[i]);
                }
            }

            dragStart.current = { x: e.clientX, y: e.clientY };
            if (foundBubble && foundBubble.parentId) {
                console.log("found bubble----!!")
                setDraggedBubble(foundBubble);
                draggedBubbleRef.current = foundBubble; // <-- update ref immediately
                setBubbleDragOffset({ x: x - foundBubble.x, y: y - foundBubble.y });
                canvas.style.cursor = 'grabbing';
            } else {
                console.log("not found bubble----!!")
                setIsDragging(true);
                // dragStart.current = { x: e.clientX, y: e.clientY };
                dragOrigin.current = { ...offset };
                canvas.style.cursor = 'grabbing';
            }
        };

        const handleMouseMove = (e) => {
            if (draggedBubbleRef.current) {
                // Bubble dragging logic
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left - canvas.width / 2 - offset.x) / scale;
                const y = (e.clientY - rect.top - canvas.height / 2 - offset.y) / scale;
                const dx = x - bubbleDragOffset.x - draggedBubbleRef.current.x;
                const dy = y - bubbleDragOffset.y - draggedBubbleRef.current.y;

                function moveBubble(bubble) {
                    bubble.x += dx;
                    bubble.y += dy;
                    if (e.shiftKey) {
                        bubble.childBubbles.forEach(moveBubble);
                    }
                }
                moveBubble(draggedBubbleRef.current);

                //update user.personalMindMap in localStorage to be mindMapData
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.personalMindMap = mindMapData;
                    localStorage.setItem('user', JSON.stringify(user));
                }


                setMindMapData({ ...mindMapData }); // trigger re-render
                return;
            }

            if (isDragging) {
                // Panning logic
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                setOffset({
                    x: dragOrigin.current.x + dx,
                    y: dragOrigin.current.y + dy
                });
            }
        };

        const handleMouseUp = (e) => {
            let dx, dy, listOfBubbleIdsToUpdate = [];
            if (e.shiftKey) {
                dx = e.clientX - dragStart.current.x;
                dy = e.clientY - dragStart.current.y;
                //loop through children of draggedBubble and all it's sub children and so on and add each id to listOfIdsToUpdate
                function collectIds(bubble) {
                    if (!bubble) return;
                    for (const child of bubble.childBubbles) {
                        listOfBubbleIdsToUpdate.push(child.id);
                        collectIds(child);
                    }
                }
                collectIds(draggedBubble);
            }
            console.log(dx, dy, 'listOfIdsToUpdate:', listOfBubbleIdsToUpdate);
            console.log('dragStart.current1:', e.clientX, e.clientY);
            console.log('dragStart.current2:', dragStart.current);
            if (draggedBubble) {
                console.log('--',draggedBubble)
                // Save the new position to the backend
                fetch(`${apiUrl}/updateBubbleCoordinates`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bubbleId: draggedBubble.id,
                        x: draggedBubble.x,
                        y: draggedBubble.y,
                        listOfBubbleIdsToUpdate: listOfBubbleIdsToUpdate,
                        dx: dx,
                        dy: dy,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Bubble updated:', data);
                })
                .catch(err => {
                    console.log('Error updating bubble:', err);
                    alert('Failed to update bubble position. Please try again.');
                });
            }
            setDraggedBubble(null);
            draggedBubbleRef.current = null; // <-- clear ref
            setIsDragging(false);
            canvas.style.cursor = 'default';
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset, mindMapData, scale]);

    useEffect(() => {
        console.log("calling useEffect 6");
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (e) => {
            e.preventDefault();
            // Zoom in for negative deltaY, out for positive deltaY
            const zoomAmount = -e.deltaY * 0.001; // Adjust sensitivity as needed
            setScale(prev => {
                let next = prev + zoomAmount;
                if (next < 0.1) next = 0.1;
                if (next > 3) next = 3;
                return next;
            });
        };

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <main>
        <button
            onClick={handleLogout}
            style={{
                position: 'absolute', top: '2rem', left: '2rem', zIndex: 10,
                background: '#fff', color: '#273c75', border: '1px solid #dcdde1',
                borderRadius: '5px', padding: '.5rem 1rem', fontSize: '1rem',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
        >Logout</button>
        <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
        {popup.visible && (
            <div
                style={{
                    position: 'absolute',
                    left: popup.x,
                    top: popup.y,
                    background: '#fff',
                    border: '1px solid #dcdde1',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    padding: '0.5rem',
                    zIndex: 100
                }}
            >
                <button
                    style={{
                        background: '#44bd32',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '1.5rem',
                        margin: '0 4px',
                        cursor: 'pointer'
                    }}
                    title="Add Bubble"
                    onClick={() => {
                        createBubble();
                        setPopup({ visible: false, x: 0, y: 0, bubble: null });
                    }}
                >+</button>
                <button
                    style={{
                        background: '#f5f6fa',
                        color: '#273c75',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '1.3rem',
                        margin: '0 4px',
                        cursor: 'pointer'
                    }}
                    title="Edit Bubble"
                    onClick={() => {
                        editBubble();
                        setPopup({ visible: false, x: 0, y: 0, bubble: null });
                    }}
                >✎</button>
                {popup.bubble?.parentId && (
                    <button
                        style={{
                            background: '#e84118',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            fontSize: '1.5rem',
                            margin: '0 4px',
                            cursor: 'pointer'
                        }}
                        title="Delete Bubble"
                        onClick={() => {
                            deleteBubble();
                            setPopup({ visible: false, x: 0, y: 0, bubble: null });
                        }}
                    >-</button>
                )}
            </div>
        )}
        </main>
    );
}