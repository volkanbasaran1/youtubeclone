import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getData } from "../helpers/getData";
import Loading from "../components/Loading";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import StringArea from "./StringArea";
import { millify } from 'millify';
import moment from "moment";
// import "moment/locale/tr" bunu yapar ve /moment 'i yukarıya eklersek yazı türkçe olur from now yazısı


const VideoInfo = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [channel, setChannel] = useState(null)

    const getInfos = async () => {
        //Kanalın ıd'si ve video bilgilerine erişme
        const detailRes = await getData(`/video/info?id=${id}`)
        //önceki istekteki kanal id'sini kullanarak kanalın detay bilgilerine
        const channelRes = await getData(`/channel/about?id=${detailRes.data.channelId}`)

        setDetail(detailRes.data)
        setChannel(channelRes.data)
    }
    useEffect(() => { //useeffectte verdiğimiz fonk'un async olmasını useef. kabul etmiyo.
        //onun içine bir fonk daha yazıp async yapılabilir. Biz bunun yerine getınfosu 
        //yukarda tanımladık burda çağırdık
        setDetail(null)
        setChannel(null)
        getInfos()
    }, [id]);

    if (!detail || !channel) {
        return <Loading type={"detail"} />
    }

    // console.log(detail, channel)
    return (
        <>
            <h1 className="mt-3 text-xl font-bold">{detail.title}</h1>
            <div className="flex justify-between mt-3">
                <div className="flex items-center gap-4">
                    <img className="rounded-full w-12 h-12" src={channel.avatar[0].url} />
                    <div>
                        <h4 className="font-bold">{channel.title}</h4>
                        <p className="text-gray-400">{channel.subscriberCountText} abone</p>
                    </div>

                    <button className="bg-white font-semibold rounded-full text-black px-3 h-9 transition hover:bg-gray-400">Subscribe</button>
                </div>
                <div className="flex items-center rounded-full bg-gray-600">
                    <div className="flex items-center gap-3 py-2 px-4 border-right">
                        <AiFillLike />
                        {/* yüzden sonra beştane sıfır olsun demek aşağıdaki kullanım 100e5 önce bunu kullandık aşağıda sonra sildik.*/}
                        <span>{Math.round(Math.random() * 100)}B</span>
                    </div>
                    <div className="py-2 px-4">
                        <AiFillDislike />
                    </div>
                </div>
            </div>

            <div className="bg-gray-600 rounded p-2 mt-4 cursor-pointer hover:bg-gray-700">
                <div className="flex gap-3">
                    <p>{millify(detail.viewCount)} izlenme</p>
                    <p>{moment(detail.publishDate).fromNow()}</p>
                    {/* buraya ileri bir tarih yazarsan örn 4 ay sonra gibi bir şeyi de fromnow hesaplar */}
                </div>
                <StringArea text={detail.description} max={300} />
            </div>

        </>
    );
}

export default VideoInfo