import { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, TextField, IconButton, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../utils/constants";
import { useTheme } from '@mui/system';
import { useVideos } from '../../Hooks/adminDashBoard/setting/useVideos';
import { customErrorLog } from '../../utils/customErrorLog';
import { Loader2, Trash } from 'lucide-react';
import { deleteVideo } from '../../api/admin/setting/deleteVideo';
import { useQueryClient } from '@tanstack/react-query';

const URLInput = ({ label, setVideoUrl, value }) => {
    const { t } = useTranslation()
    const theme = useTheme()
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            mb={1}
        >
            <Typography textAlign="center" variant="body2" mb={1} sx={{ fontSize: "11px", color: theme.palette.text.gray }}>
                {label}
            </Typography>
            <TextField
                variant="outlined"
                placeholder={t("pastUrlHere")}
                value={value}
                onChange={(e) => setVideoUrl(e.target.value)}
                fullWidth
                InputProps={{
                    sx: {
                        borderRadius: '20px',
                        backgroundColor: theme.palette.bodyColor.secandaryInput,
                        height: '25px',
                        fontSize: '10px',
                        padding: '0 10px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    },
                }}
            />
        </Box>
    )
};

export const Videos = forwardRef((props, ref) => {
    const [urls, setUrls] = useState(["Main", "Vid01"]);
    const [videoUrls, setVideoUrls] = useState({});

    const addUrlInput = () => {
        const newLabel = `Vid${urls.length}`;
        setUrls([...urls, newLabel]);
    };

    const handleUrlChange = (label, value) => {
        setVideoUrls(prev => ({
            ...prev,
            [label]: value
        }));
    };
    const { t } = useTranslation()
    const handleSave = () => {
        const validUrls = Object.values(videoUrls).filter(url => url.trim() !== '');

        if (validUrls.length < 1) {
            toast.error(t("plAddAtleastOneVideo"));
            return;
        }

        const bundleData = {
            video: validUrls
        };


        fetch(`${BASE_URL}settings/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(bundleData)
        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to save videos');
                }
                return data;
            })
            .then(data => {
                toast.success(t("videoAddSucc"));
                setVideoUrls({}); // Clear the input fields after saving
            })
            .catch(error => {
                console.error('Error saving videos:', error);
                toast.error(error.message || t("videoAddErr"));
            });
    };
    // send handleSave to parent component
    useImperativeHandle(ref, () => ({
        saveVideos: handleSave,
    }));

    const [deletingIds, setDeletingIds] = useState([]);
    const queryClient = useQueryClient();
    const { data } = useVideos();
    const handleVideo = async (id) => {
        setDeletingIds((prev) => [...prev, id]);
        try {
            const response = await deleteVideo(id)
            queryClient.invalidateQueries(['website-videos']);
        } catch (error) {
            console.log(error)
        } finally {
            setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));
        }
    }

    return (
        <>
            <Paper sx={{ width: "100%", borderRadius: "20px", height: "400px", padding: "20px 30px" }}>
                <Typography variant='body2' sx={{ color: "#cacacaf1", fontSize: "11px" }}>W:1500px H:500px</Typography>

                <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                    {urls.map((label, index) => (
                        <URLInput
                            key={index}
                            label={label}
                            value={videoUrls[label] || ''}
                            setVideoUrl={(value) => handleUrlChange(label, value)}
                        />
                    ))}

                    <IconButton onClick={addUrlInput}>
                        <AddIcon fontSize="large" sx={{ color: 'grey', opacity: 0.5 }} />
                    </IconButton>
                </Box>
            </Paper>
            {
                data?.data?.map(item => {

                    return (
                        <div className='bg-white mx-2 my-4 text-black px-2 py-4 rounded-xl flex justify-between'>
                            <YouTubeLink rawUrl={item.video} />
                            <button
                                onClick={() => handleVideo(item?.id)}
                                disabled={deletingIds.includes(item.id)}
                            >
                                {deletingIds.includes(item.id) ? <Loader2 className="animate-spin text-gray-500" size={24} /> : <Trash size="24px" color='red' />}
                            </button>
                        </div>
                    )
                })
            }
        </>
    );
});


const YouTubeLink = ({ rawUrl }) => {
    const cleanedUrl = rawUrl
        .replace(/^"+|"+$/g, '')       // remove surrounding quotes
        .replace(/\\\//g, '/');        // unescape slashes

    return (
        <a href={cleanedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {cleanedUrl}
        </a>
    );
};