import React, { useState } from 'react'
import UseTailwind from '../../../utils/use-tailwind/UseTailwind'
import { useFeature } from '../../../Hooks/adminDashBoard/setting/useFeature'
import { customErrorLog } from '../../../utils/customErrorLog';
import { BASE_URL_IMG } from '../../../utils/constants';
import { Trash } from 'lucide-react';
import { deleteFeature } from '../../../api/admin/setting/deleteFeature';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@mui/system';


const FeatureList = () => {
  const { data } = useFeature();
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient();
  const theme = useTheme();

  const handleDeleteFeature = async (id) => {
    try {
      setLoading(true)
      const response = await deleteFeature(id)
      queryClient.invalidateQueries(['website-feature']);
    } catch (error) {
      console.log("error delete feature", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UseTailwind>
      {
        data?.data?.map(item => {

          let img = null;
          let title = null
          let descriptions = null
          let features = null
          try {
            img = JSON.parse(item.img);
            title = JSON.parse(item.titles); // ['["en","ar"]']
            title = JSON.parse(title); // ['en', 'ar']
            descriptions = JSON.parse(item.descriptions); // ['["en","ar"]']
            descriptions = JSON.parse(descriptions); // ['en', 'ar']
            features = JSON.parse(item.features); // ['["en","ar"]']
            features = JSON.parse(features); // ['en', 'ar']

          } catch (error) {
            console.error("Failed to parse item", error);
          }
          return (
            <div
              style={{ backgroundColor: theme.palette.bodyColor.secandary, color: theme.palette.text.black_white }}
              className="bg-white rounded-xl p-4 mt-4 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between gap-4">
                {/* Left: Image + Info */}
                <div className="flex gap-4">
                  <img
                    src={`${BASE_URL_IMG}${img}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-lg ">{title?.[0]}</p>
                    <p className="text-sm ">
                      Description: <span className="">{descriptions?.[0]}</span>
                    </p>
                    <div>
                      <p className="text-sm font-medium ">Features:</p>
                      <ul className="list-disc pl-4 text-sm">
                        {features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right: Delete Button */}
                <div className="shrink-0">
                  <button className="text-red-600 hover:text-red-800 transition" onClick={() => handleDeleteFeature(item.id)}>
                    <Trash size="24px" />
                  </button>
                </div>
              </div>
            </div>

          )
        }
        )
      }
    </UseTailwind>
  )
}

export default FeatureList