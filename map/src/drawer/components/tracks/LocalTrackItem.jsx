import React, { useContext, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { ListItemText, MenuItem, Switch, Tooltip, Typography } from '@mui/material';
import _ from 'lodash';
import TracksManager from '../../../context/TracksManager';

export default function LocalTrackItem({ track, index }) {
    const ctx = useContext(AppContext);
    const [indexTrack, setIndexTrack] = useState(index);

    function enableLayer(visible) {
        if (!visible) {
            deleteTrackFromMap();
        } else {
            addTrackToMap();
        }
    }

    function cleanSelectedTrackIfNeed(currentTrack) {
        if (ctx.selectedGpxFile && ctx.selectedGpxFile.name === currentTrack.name) {
            if (ctx.createTrack) {
                ctx.createTrack.enable = false;
                ctx.createTrack.clear = true;
                ctx.setCreateTrack({ ...ctx.createTrack });
            }
        }
    }

    function deleteTrackFromMap() {
        let currentTrack = ctx.localTracks[track.index];
        currentTrack.selected = false;
        cleanSelectedTrackIfNeed(currentTrack);
        ctx.setLocalTracks([...ctx.localTracks]);
    }

    function addTrackToMap() {
        if (indexTrack !== undefined) {
            updateLocalTrack(track);
            updateTrackInfoBlock();
            startEdit();
        }
    }

    function updateLocalTrack(selectedTrack) {
        track.index = indexTrack;
        setIndexTrack(indexTrack);
        selectedTrack.selected = true;
        selectedTrack.zoom = true;
        selectedTrack.analysis = TracksManager.prepareAnalysis(selectedTrack.analysis);
        ctx.setSelectedGpxFile(selectedTrack);
        ctx.setLocalTracks([...ctx.localTracks]);
    }

    function updateTrackInfoBlock() {
        let type = ctx.OBJECT_TYPE_LOCAL_CLIENT_TRACK;
        ctx.setCurrentObjectType(type);
        ctx.setUpdateContextMenu(true);
    }

    function startEdit() {
        if (ctx.createTrack?.enable) {
            ctx.setCreateTrack({
                enable: true,
                edit: true,
                closePrev: {
                    file: _.cloneDeep(ctx.selectedGpxFile),
                },
            });
        } else {
            ctx.setCreateTrack({
                enable: true,
                edit: true,
            });
        }
    }

    return (
        <div>
            <MenuItem key={'track._leaflet_id' + indexTrack} onClick={() => addTrackToMap()}>
                <Tooltip title={<div>{track.name}</div>}>
                    <ListItemText inset>
                        <Typography variant="inherit" noWrap>
                            {'* ' + track.name}
                        </Typography>
                    </ListItemText>
                </Tooltip>
                <Switch
                    checked={track.selected === true || ctx.selectedGpxFile?.name === track.name}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        enableLayer(e.target.checked);
                    }}
                />
            </MenuItem>
        </div>
    );
}